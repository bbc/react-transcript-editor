# Re-aligning Timed Text

* Status: being evaluated 
* Deciders: Pietro, James
* Date: 2018-12-10

## Context and Problem Statement

<!-- [Describe the context and problem statement, e.g., in free form using two to three sentences. You may want to articulate the problem in form of a question.] -->

When the user edits the timed text the transcriptions might lose the timecodes information over time after a number of edits. Eg if deleting a paragraph or line and re-writing it from scratch these words might not have time information associated with it.

Can we find a straightforward way to either preserve or restore the time information associated with the words of the corrected transcription?

## Decision Drivers <!-- optional -->

* easy to reason around 
* not too computational intensive
* the re-alignment operation can be performed on the client side
* Approach with a flexible granularity, eg re-align the whole text or just a paragraph or sentence

## Considered Options


1. re-sync using audio waveform (TTS)
2. Transpose time-codes from STT transcript 
3. Interpolate time-codes (words within a sentence)
4. Use Levenshtein distance (sentence level)

* … <!-- numbers of options can vary -->

## Decision Outcome

_still being evaluated_

<!-- Chosen option: "[option 1]", because [justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force force | … | comes out best (see below)].

### Positive Consequences 

* [e.g., improvement of quality attribute satisfaction, follow-up decisions required, …]
* …

### Negative consequences 

* [e.g., compromising quality attribute, follow-up decisions required, …]
* …

## Pros and Cons of the Options  -->

### re-sync using audio waveform (TTS)

[example | description | pointer to more information | …] <!-- optional -->

* Good, because [argument a]
* Good, because [argument b]
* Bad, because [argument c]
* … <!-- numbers of pros and cons can vary -->

### [option 2]

[example | description | pointer to more information | …] <!-- optional -->

* Good, because [argument a]
* Good, because [argument b]
* Bad, because [argument c]
* … <!-- numbers of pros and cons can vary -->

### [option 3]

[example | description | pointer to more information | …] <!-- optional -->

* Good, because [argument a]
* Good, because [argument b]
* Bad, because [argument c]
* … <!-- numbers of pros and cons can vary -->

## Links <!-- optional -->

* [Link type] [Link to ADR] <!-- example: Refined by [ADR-0005](0005-example.md) -->
* … <!-- numbers of links can vary -->



<!-- 
- Docs ReactTranscriptEditor
	- Confluence Page 
	- Guide


	- ADR + Notes on alignement 
	https://github.com/bbc/stt-align
	https://github.com/bbc/alignment-from-stt
	
	https://github.com/chrisbaume/webaligner
	Aeneas

	https://github.com/pietrop/srtParserComposer


- Show / hide speakers/timecodes 



- ad atJson to ADR on textEditor





 -->