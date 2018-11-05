# Fonts fo the component

* Status: **accepted** <!-- optional -->
* Deciders: Pietro <!-- optional -->
* Date: 2018-10-02 <!-- optional -->

<!-- Technical Story: [description | ticket/issue URL]  -->

## Context and Problem Statement

<!-- [Describe the context and problem statement, e.g., in free form using two to three sentences. You may want to articulate the problem in form of a question.] -->

Should the component come with it's own font? or just inherit from the app/enviroment it has been used in?


<!--
## Decision Drivers

 * [driver 1, e.g., a force, facing concern, …] -->

<!-- 
## Considered Options

*  -->



## Decision Outcome


Looking into mono or duo space fonts can help with readability, [see this article](https://ia.net/topics/in-search-of-the-perfect-writing-font
)


Default system stack,  covers most monospaced ones in various systems
```
/* Monospace stack */
font-family: Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier, monospace;
```

fall-backs
```
font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
```

https://www.cssfontstack.com/Helvetica


As it is a component, concluded it should not enforce anything in css.



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