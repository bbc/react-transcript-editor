# Timed Text Editor Choice  - draft

* Status: **accepted** <!-- optional -->
* Deciders: Pietro, James <!-- optional -->
* Date: 2018-10-01 <!-- optional -->

<!-- Technical Story: [description | ticket/issue URL]  -->

## Context and Problem Statement

<!-- [Describe the context and problem statement, e.g., in free form using two to three sentences. You may want to articulate the problem in form of a question.] -->

To build a timed text editor, for editing audio or video transcriptions it can be useful to use an open source text editor and add functionalities to it.


## Decision Drivers <!-- optional -->

<!-- * [driver 1, e.g., a force, facing concern, …] -->
* A simple and straight forward way to keep words and time in sync, during playback and text editing.

## Considered Options

* [Draft.js](https://draftjs.org/)
* [Quill.js](https://quilljs.com/)
* [Prose mirror](https://prosemirror.net/) + [NY times article "Building a Text Editor for a Digital-First Newsroom"](https://open.nytimes.com/building-a-text-editor-for-a-digital-first-newsroom-f1cb8367fc21)
* [atJson](https://github.com/CondeNast-Copilot/atjson)


## Decision Outcome

Chosen option: **Draft.js**, because there is previous work in this space that has explored and stressed tests this editor. 

Altho Quilljs has a straight forward API, despite [a quircky data model internal  representation](https://quilljs.com/docs/delta). And has been used to quickly make [text based prototypes](https://github.com/pietrop/annotated_article_generator) (see [demo](http://pietropassarelli.com/annotated_article_generator/)) even with multi user collaboration support [through togetherjs](https://togetherjs.com/). 

It's hard  to tell whether Quilljs is going to be around long term, while draft.js being core part of facebook is starting to see more of a community around it,  and a growing number of plugins.

There also other more advanced features, like adding speakers label, timed text, and other non timed text in the transcription that has workarounds in Draftjs but is not immediatly obvious how it would be implemented in Quilljs.


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