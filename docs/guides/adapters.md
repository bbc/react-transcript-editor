# Guide: How to Create an Adapter - Draft

_this is a draft. we'd like this guide to be relatively easy to read for newcomers, so [feel free to raise an issue](https://github.com/bbc/react-transcript-editor/issues/new?template=question.md) if you think anything is unclear and we'd be happy to address that._

Adapters are used to enable the `TranscriptEditor` component to convert various STT transcripts into a format draftJS can understand to provide data for the `TimedTextEditor`.

## How to create a new adapter

If you want to create a new adapter for a new STT service that is not yet supported by the component, we welcome [PRs](https://help.github.com/articles/about-pull-requests/).

1. [Begin by raising an issue (optional)](https://github.com/bbc/react-transcript-editor/issues/new?template=feature_request.md) so that others can be aware that there is active development for that specific STT service, and if needed we can synchronize the effort.
2. [Fork the repo](https://help.github.com/articles/fork-a-repo/) and
   create a branch with the name of the STT service, eg `stt-adapter-speechmatics`.

### Context - How does an Adapter work

To develop a new adapter, it's best to understand what the adapters are doing.

When we call `sttJsonAdapter` with `transcriptData` and a `sttJsonType`, we expect it to return an object with two attributes `blocks` and `entityMap`.

The output is then used in `TimedTextEditor` with the Draft JS function [convertFromRaw](https://draftjs.org/docs/api-reference-data-conversion#convertfromraw) to create a new content state for the editor.

```js
const draftJSCompatibleJSON = sttJsonAdapter(transcriptData, sttJsonType);

/* draftJSCompatibleJSON:
  {
    "blocks": [],
    "entityMap": {}
  }
  */

/* Inside TimedTextEditor */
const contentState = convertFromRaw(draftJSCompatibleJSON);
```

So in order to convert an STT JSON to Draft JS JSON we need to made sure our adapter generates:

- a data [block](https://draftjs.org/docs/api-reference-content-block#docsNav)
- [entityRanges](https://draftjs.org/docs/advanced-topics-entities)
- `entityMap`

**Note**: `entityMap` and `entityRanges` will be generated programmatically by dedicated functions.

#### Blocks, entityRanges and entityMap

Checkout [a doc on how the DraftJS `block`, `entityRanges` and `entityMap` works, in the context of the TranscriptEditor component](./draftjs-blocks-entityrange-entitymap.md). Or feel free to skip this and come back later to it, if you are not interested in the underlying implementation.

### File and function structure

This is the recommended structure for keeping consistency across multiple adapter libraries. Here `${sttServiceName}` is the STT service name that you want to build the adapter for, such as `speechmatics`. Make sure that it's not capitalized.

| file structure                                                                 |
| ------------------------------------------------------------------------------ |
| `packages/stt-adapters/${sttServiceName}/index.js`                             |
| `packages/stt-adapters/${sttServiceName}/sample`                               |
| `packages/stt-adapters/${sttServiceName}/sample/${sttServiceName}.sample.json` |

| function name              | description                                                                                                                                                                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `${sttServiceName}ToDraft` | the single exported function in your `${sttServiceName}/index.js`. Converts and outputs necessary data to be used in `convertFromRaw`. See [the recommended approach](#approach-for-converting-stt-to-draftjs-blocks-and-entityranges) |

## Steps

In your branch:

1. Follow the [recommended file structure as above](#file-and-function-structure) and create the folders and files necessary.
   1. [ ] Create a folder with the name of the STT service
   2. [ ] add a `sample` folder inside your `${sttServiceName}` folder
   3. [ ] add a sample json file to the `sample` folder: `${sttServiceName}.sample.json`. This will be used for [testing](#tests).
   4. Check this JSON file is excluded from the build bundle
2. [ ] [add the new adapter and function to the STT Adapter package](#add-adapter-to-stt-adapter-package)
3. [ ] create a function that [convert the STT data structure into draftJs blocks and entityRanges](#approach-for-converting-stt-to-draftjs-blocks-and-entityranges).
   1. You can see examples from `bbc-kaldi` and `autoEdit2` adapters.

### Approach for converting STT to `DraftJS` `blocks` and `entityRanges`

In pseudocode it's recommended to follow this approach:

1. Expose one function call that takes in the STT json data
2. Have a helper function `groupWordsInParagraphs` that as the name suggests groups words list from the STT provider transcript based on punctuation. and returns an array of words objects.
   1. The underlying details for this will vary depending on how the STT json of the provider present the data, and how the attributes are named etc..
3. [Iterate over the paragraphs to create draftJS content blocks](#iterate-over-the-paragraphs-to-create-draftjs-content-blocks) (see `bbc-kaldi` and `autoEdit2` example).
4. And use the helper function `generateEntitiesRanges` to add the `entityRanges` to each block. - see above
5. If you have speaker diarization info you can also add this to the block info - _optional_

### Add adapter to STT Adapter Package

1. [ ] Import the adapters converting function `${sttServiceName}ToDraft`
   1. This function should follow the [recommended approach to convert the data](#approach-for-converting-stt-to-draftjs-blocks-and-entityranges).
2. [ ] Add case to `sttJsonAdapter`
   1. There is an `sttJsonAdapter` function inside the [`adapters`](../../packages/stt-adapters/index.js).
      In this `switch/case` function, add a new `case` with the new STT service type e.g. `speechmatics`

  <!-- TODO: modify import path if module is moved/refactored -->

For example, if you were adding a `speechmatics` adapter, the code should now look like this:

```js
import speechmaticsToDraft from './speechmatics';

...

case 'speechmatics':
      blocks = speechmaticsToDraft(transcriptData);
      return { blocks, entityMap: createEntityMap(blocks) };
```

### Iterate over the paragraphs to create draftJS content blocks

```js
wordsByParagraphs.forEach((paragraph, i) => {
  const draftJsContentBlockParagraph = {
    text: paragraph.text.join(" "),
    type: "paragraph",
    data: {
      speaker: `TBC ${i}`,
      words: paragraph.words, //
      start: paragraph.words[0].start, //
    },
    // the entities as ranges are each word in the space-joined text,
    // so it needs to be compute for each the offset from the beginning of the paragraph and the length
    entityRanges: generateEntitiesRanges(paragraph.words, "text"), // wordAttributeName
  };
  // console.log(JSON.stringify(draftJsContentBlockParagraph,null,2))
  results.push(draftJsContentBlockParagraph);
});
```

## Speaker Labels

If the speech-to-text returns speaker label (speaker diarization info) you can either use that in the adapter, to associated that info at a paragraph level. Or leave it out for later implementation.

If you decide to incorporate speaker labels, then change the `TBC` to `Speaker ${speakerLabelFromSTTprovider}`,

We have been informally using `TBC` as a placeholder when the STT service doesn't return any speaker diarization info, and/or when it has not been incorporated in the adapter yet.

## Tests

This project uses Jest. and once you submit the PR the tests are run by TravisCI. It is recommended to write some basic tests at a minimum so that you can see at a glance if the adapter is working as expected.

In order to write your tests, you want to have a `sample` folder with transcript data from STT and expected draftJs data output with file extensions `.sample.json` and `.sample.js` - see `bbc-kaldi` and `autoEdit2` example. This is so that those stub/example files are not bundled with the component when packaging for NPM.

You can create and run your `example-usage.js` file and save the output json. This can be used to create the `.sample.js` file for the main test.

_If you don't have much experience with automated testing don't let this put you off tho, feel free to raise it as an issue and we can help out._

### Testing randomly generated DraftJS Block attributes

**top tip**: the DraftJS block key attributes are randomly generated, and therefore cannot be tested in a deterministic way. However there is a well established workaround:

- you can replace them in the JSON with a type definition.
- e.g. instead of expecting it to be a specific number, you just expect it to be a string.

In practice, in Visual code, you can search using a regex (option `*`). So you could search for

```js
"key": "([a-zA-Z0-9]*)",
```

And replace all with

```js
"key": expect.any(String),//"ss8pm4p"
```
