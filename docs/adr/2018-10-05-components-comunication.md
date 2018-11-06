# React components communication strategy

* Status: being evaluated <!-- optional -->
* Deciders: Pietro, James <!-- optional -->
* Date: 2018-10-05 <!-- when the decision was last updated] optional -->


## Context and Problem Statement

Deciding how to have the internal components of the Transcript Editor communicate with each other.

## Decision Drivers <!-- optional -->

* Simple and straightforward way to reason around passing data between components
* Extensible anticipating use cases when using the component "in the wild" and having internal info accessible/when if needed.


## Considered Options

* Parent component 
* Flux / Redux
* Event driven eg `pubsub-js`

## Decision Outcome

<!-- Chosen option: "[option 1]", because [justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force force | … | comes out best (see below)]. -->

Still evaluating, leaning torwards some light refactoring to enable parent component, option 1 to keep things simple.

<!-- ### Positive Consequences 

* [e.g., improvement of quality attribute satisfaction, follow-up decisions required, …]
* …

### Negative consequences 

* [e.g., compromising quality attribute, follow-up decisions required, …]
* … -->

## Pros and Cons of the Options <!-- optional -->

### Parent component 

[example | description | pointer to more information | …]

pointer to more information - see [Blog post - "8 no-Flux strategies for React component communication"](https://www.javascriptstuff.com/component-communication/)

* Good, because With some light refactor, if needed, could be the most straightforward and lightweight implementation 
 * Good, because It might make the component easier to test with automated testing 
<!-- * Good, because [argument b]
* Bad, because [argument c] -->

* Bad, because it might not extend well for use case when you need to have insights on what's happening inside the component, eg use selecting text, or clicking on words, playing media etc..

### Flux / Redux

 pointer to more information - [Flux](https://facebook.github.io/flux/)/[Redux](https://redux.js.org/introduction)

* Good, Allows to have single source of truth in a store and not communication from sibling to sibling,

* Bad, Might be overkill for what we are trying to do, keeping things simple and limiting the learning curve for newcomers to the project.


### Event driven eg `pubsub-js`

Pointer to more information - [`pubsub-js`](https://www.npmjs.com/package/pubsub-js)

* Good, could provide a clean interface for other components when used in other applications. Eg if you want to be notified every-time some text is selected in the editor, or video is playing etc.. 

* Bad, Might be difficult to test 
* Bad, might cause issues with keeping track of local state

