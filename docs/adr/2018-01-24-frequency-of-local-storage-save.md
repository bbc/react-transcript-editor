# Frequency of local storage save

* Status: **accepted** <!-- optional -->
* Deciders: Pietro <!-- optional -->
* Date: 2019-01-24 <!-- optional -->

<!-- Technical Story: [description | ticket/issue URL]  -->

## Context and Problem Statement

<!-- [Describe the context and problem statement, e.g., in free form using two to three sentences. You may want to articulate the problem in form of a question.] -->

The issue is how often to save to local storage when a user types, previous implementation saved every 5 characters. But that caused issues [#86](https://github.com/bbc/react-transcript-editor/issues/86)



## Decision Drivers <!-- optional -->

<!-- * [driver 1, e.g., a force, facing concern, …] -->
* A simple and straight forward way to save to local storage
* saving on a good frequency 
* without introducing performance issues especially on less performant devices
* if possible without introducing third party dependencies 

## Considered Options

* [loadash debounce](https://lodash.com/docs/4.17.11#debounce)
* using a js timer 

## Notes on debounce option 

What is a debounce function?

> debounce function does, it limits the rate at which a function can fire.
> [...] You'll pass the debounce function the function to execute and the fire rate limit in milliseconds

from https://john-dugan.com/javascript-debounce/ 

In more detail

https://davidwalsh.name/javascript-debounce-function

with examples

https://css-tricks.com/debouncing-throttling-explained-examples/ 


https://lodash.com/docs/4.17.11#debounce

## Decision Outcome

Chosen option: **using a js timer**. 

It uses a timer that can be consolidated into one final one rather then having a lot of saves being delayed, we just have one final save once after user has stopped typing for more then 5 seconds.

The timer is cleared before being called so that there is only the final one left. Leaving only one final save at the end. As a performance optimization.

```js
if (this.saveTimer!== undefined) {
    clearTimeout(this.saveTimer);
}
this.saveTimer = setTimeout(() => {
    this.localSave(this.props.mediaUrl);
}, 5000);
```


 <!-- because [justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force force | … | comes out best (see below)]. -->


<!-- 
### Positive Consequences

* [e.g., improvement of quality attribute satisfaction, follow-up decisions required, …]
* …

### Negative consequences 

* [e.g., compromising quality attribute, follow-up decisions required, …]
* …

## Pros and Cons of the Options 

### [option 1]

[example | description | pointer to more information | …] 

* Good, because [argument a]
* Good, because [argument b]
* Bad, because [argument c]

### [option 2]

[example | description | pointer to more information | …]

* Good, because [argument a]
* Good, because [argument b]
* Bad, because [argument c]


### [option 3]

[example | description | pointer to more information | …] 

* Good, because [argument a]
* Good, because [argument b]
* Bad, because [argument c]


## Links 

* [Link type] [Link to ADR]  -->