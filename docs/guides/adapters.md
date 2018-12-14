# Guide: How to Create an Adapter - Draft

_this is a draft. we'd like this guide to be relatively easy to read for newcomers, so [feel free to raise an issue](https://github.com/bbc/react-transcript-editor/issues/new?template=question.md) if you think anything is unclear and we'd be happy to address that._

Adapters are used to enable the `TranscriptEditor` component to convert various STT transcripts into a format draftJS can understand to provide data for the `TimedTextEditor`.

## How to create a new adapter
If you want to create a new adapter for a new STT service that is not yet supported by the component, we welcome [PRs](https://help.github.com/articles/about-pull-requests/).

[Feel free to begin by raising an issue](https://github.com/bbc/react-transcript-editor/issues/new?template=feature_request.md) so that others can be aware that there is active development for that specific STT service, and if needed we can synchronies the effort.

[Fork the repo](https://help.github.com/articles/fork-a-repo/) and 
create a branch with the name of the stt service, eg `stt-adapter-speechmatics`.

<!-- TODO: adjust link -->

## context

To see this in the larger context when we call `sttJsonAdapter` with `transcriptData` and a `sttJsonType` we expect it to return an boject with two attributes `blocks` and `entityMap`.  

This is then used within TimedTextEditor with the help of draftJs function [convertFromRaw](https://draftjs.org/docs/api-reference-data-conversion#convertfromraw) to create a new content state for the editor.

So in order to convert a json from STT from service to draftJs json we need to create:
- a data [block](https://draftjs.org/docs/api-reference-content-block#docsNav)
- [entityRanges](https://draftjs.org/docs/advanced-topics-entities) 
- `entityMap` 

Note that  `entityMap` and `entityRanges` will get generated programmatically by dedicated functions.

checkout [a quick side note on how the DraftJS `block`, `entityRanges` and `entityMap` works, in the context of the TranscriptEditor component](./draftjs-blocks-entityrange-entitmap.md). Or feel free to skip this and come back later to it, if you are not interested in the underlying implementation.

## Steps

In your branch 

- [ ] Create a folder with the name of the STT service - eg `speechmatics`
- [ ] add a `adapters/${sttServiceName}/sample` folder
- [ ] add a sample json file from the STT service in this last folder - this will be useful for testing.
<!-- TODO: we should check these json are excluded from the bundle -->
- [ ] add option in [adapters/index.js](adapters/index.js)

In the adapters [adapters/index.js](adapters/index.js) in the  `sttJsonAdapter` function switch statement add a new `case` with the new STT service type eg `speechmatics`

<!-- TODO: modify import path if module is moved/refactored -->
```js
import speechmaticsToDraft from './speechmatics/index';

...

case 'speechmatics':
      blocks = speechmaticsToDraft(transcriptData);
      return { blocks, entityMap: createEntityMap(blocks) };
```

- [ ] add an adapter function.

as shown in the example you'd also need to add a function with the stt provider name +`ToDraft` eg `speechmaticsToDraft`that takes in the transcript data.

- [ ] create a function to convert the STT data structure into draftJs blocks and entityRanges.

You can see examples from `bbc-kaldi` and `autoEdit2` adapters.

In pseudocode it's reccomended to follow this approach:

1. Expose one function call that takes in the stt json data
2. have a helper function `groupWordsInParagraphs` that as the name suggests groups words list from the STT provider transcript based on punctuation. and returns an array of words objects.

The underlying details for this will vary depending on how the STT json of the provider present the data, and how the attributes are named etc..

3. iterate over the paragraphs to create draftJS content blocks (see `bbc-kaldi` and `autoEdit2` example).

```js
wordsByParagraphs.forEach((paragraph, i) => {
    const draftJsContentBlockParagraph = {
      text: paragraph.text.join(' '),
      type: 'paragraph',
      data: {
        speaker: `TBC ${ i }`,
        words: paragraph.words, //
        start: paragraph.words[0].start//
      },
      // the entities as ranges are each word in the space-joined text,
      // so it needs to be compute for each the offset from the beginning of the paragraph and the length
      entityRanges: generateEntitiesRanges(paragraph.words, 'text'), // wordAttributeName
    };
    // console.log(JSON.stringify(draftJsContentBlockParagraph,null,2))
    results.push(draftJsContentBlockParagraph);
  });

```

4. and use the helper function `generateEntitiesRanges` to  add the `entityRanges` to each block. - see above

5. If you have speaker diarization info you can also add this to the block info - _optional_


## tests

This project uses jest. and TravisCI. It is recommended to write some basic tests at a minimum so that you can see at a glance if the adapter is working as expected (see `bbc-kaldi` and `autoEdit2` example). 

_If you don't have much experience with automated testing don't let this put you off tho, feel free to raise it as an issue and we can help out._

**top tip**: when preparing your expected results for the test, you might need to allow jest to be less specific about the key attributes, these are randomly generated, and therefore cannot be tested in a deterministic way.

However there is a well established workaround, you can replace them in the json with a type definition. eg instead of expecting it to be a specific number, you just expect it to be a string.

In practice, for instance In Visual code you can search using a regex (option `*`). So you could search for 

```js
"key": "([a-zA-Z0-9]*)"
```
And replace all with 
```js
"key": expect.any(String)//"ss8pm4p"
```
