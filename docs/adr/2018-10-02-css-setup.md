# CSS setup - draft

* Status: **accepted** <!-- optional -->
* Deciders: Pietro, James <!-- optional -->
* Date: 2018-10-02 <!-- optional -->

<!-- Technical Story: [description | ticket/issue URL]  -->

## Context and Problem Statement

<!-- [Describe the context and problem statement, e.g., in free form using two to three sentences. You may want to articulate the problem in form of a question.] -->

Decision around how to setup css on the project.

## Decision Drivers <!-- optional -->

<!-- * [driver 1, e.g., a force, facing concern, …] -->
* A simple and straight forward way to work with CSS, keep scope of selectors at module level to insulate the component if used as part of another app.
* A simple way to organise the layout of the component.

## Considered Options

* [Bootstrap 4](https://getbootstrap.com)
* [CSS Flex Box](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox)
* [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids) 


## Decision Outcome

Decided to use CSS Grid-layout and CSS Flexbox, as the two can be combined.

Bootstrap is familiar, convenient and easy to use, but it's bulky and might introduce un-necessary dependencies and weight to the project file size.

Followed [this article](https://medium.com/samsung-internet-dev/common-responsive-layouts-with-css-grid-and-some-without-245a862f48df) (_"The Holy Grail Layout (with no set heights!)"_) for CSS Grid-layout introduction and [example](https://glitch.com/edit/#!/card-layout?path=README.md:1:0), [demo](https://grid-grail.glitch.me/).

See also 

- [Gridlayout tutorial](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flex Box tutorial](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

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