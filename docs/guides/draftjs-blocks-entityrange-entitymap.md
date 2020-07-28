# DraftJS Block, entityRanges and entityMap

A quick side note on how the DraftJS block, entityRanges and entityMap works, in the context of the TranscriptEditor component. For the [adapters](./adapters.md) guide.

## Block

TL;DR:

- a block is a representation of a paragraph (as an Immutable Record) in draftJs and you can have some custom data associated to it.
  But see the docs notes on [DraftJS basics](https://github.com/bbc/react-transcript-editor/blob/master/docs/notes/draftjs/2018-10-01-draftjs-1-basics.md) to better understand the role of content block within the editor. As well as the draftJs official docs.

Here's an example of a Block, you can see it can contain some custom data, eg speaker name, list of words, and start time (which would be the start time of the first word).

```js
[
  {
    "text": "There is a day.", // text
    "type": "paragraph", // type of block
    "data": { //optional custom data
      "speaker": "TBC 0",
      "words": [
       ...
      ],
      "start": 13.02
    },
    "entityRanges": [ // <-- entity ranges
   ...
    ]
  },
  ...
```

It also contains a list of `entityRanges`.

## Entity Ranges

`entityRanges` are part of individual Blocks.

<!-- See the docs notes on [DraftJS entity ranges](https://github.com/bbc/react-transcript-editor/blob/master/docs/notes/draftjs/2018-10-02-drafjs-2-entity-range.md) -->

From Draft JS docs on [entity](https://draftjs.org/docs/advanced-topics-entities)

> the Entity system, which Draft uses for annotating ranges of text with metadata. Entities introduce levels of richness beyond styled text. Links, mentions, and embedded content can all be implemented using entities.

This is what we use to identify the words, from a list of characters, and associate data to it, such as start and end time information.
It sets the foundations for features such as click on a word can jump the player play-head to the corresponding time for that word.
Here's an example of `entityRanges` in the context of a data Block.
Required fields are the `offset`, and `length`, which are used to identify the entity within the characters of the `text` attribute of the block.
This, combined with the `entityMap` has the advantage that if you type or delete some text before a certain entity, draftJs will do the ground work of adjusting the offsets and keeping these info in sync.

```js
[
  {
    "text": "There is a day.",
    "type": "paragraph",
    "data": {
      ...
    },
    "entityRanges": [
      {
        "start": 13.02, // Custom fields
        "end": 13.17, // Custom fields
        "confidence": 0.68, // Custom fields
        "text": "There", // Custom fields - to detect what has changed
        "offset": 0,  // Required by Draft.js to know start of "selection"
        "length": 5, //Required by Draft.js to know end of "selection" -  in our case a word
        "key": "ctavu0r" // can also be provided by draftjs if not provided. But providing your own gives more flexibility
      },
      ...
```

### Entity Map

`entityMap` defines how to render the entities for the draftJs content state.
See draftJs docs for more on [entities](https://draftjs.org/docs/advanced-topics-entities#introduction)
And keeps in sync `entityRanges` through the `offset` and `length` attribute.

Here's an example:

```js
{
  "ayx62lj": {
    "type": "WORD",
    "mutability": "MUTABLE",
    "data": {
      "start": 13.02,
      "end": 13.17,
      "confidence": 0.68,
      "text": "There",
      "offset": 0,
      "length": 5,
      "key": "ayx62lj"
    }
  },
```

To see this in the larger context when we call `sttJsonAdapter` with `transcriptData` and a `sttJsonType` we expect it to return an object with two attributes `blocks` and `entityMap`.

```js
{
  "blocks": [
    {
      "key": "500r2",
      "text": "There is a day.",
      "type": "paragraph",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [
        {
          "offset": 0,
          "length": 5,
          "key": 0
        },
        {
          "offset": 6,
          "length": 2,
          "key": 1
        },
        {
          "offset": 9,
          "length": 1,
          "key": 2
        },
        {
          "offset": 11,
          "length": 4,
          "key": 3
        }
      ],
      "data": {
        "speaker": "test4",
        "words": [
          {
            "start": 13.02,
            "confidence": 0.68,
            "end": 13.17,
            "word": "there",
            "punct": "There",
            "index": 0
          },
          {
            "start": 13.17,
            "confidence": 0.61,
            "end": 13.38,
            "word": "is",
            "punct": "is",
            "index": 1
          },
          {
            "start": 13.38,
            "confidence": 0.99,
            "end": 13.44,
            "word": "a",
            "punct": "a",
            "index": 2
          },
          {
            "start": 13.44,
            "confidence": 1,
            "end": 13.86,
            "word": "day",
            "punct": "day.",
            "index": 3
          }
        ],
        "start": 13.02
      }
    },
...
  ],
  "entityMap": {
    "0": {
      "type": "WORD",
      "mutability": "MUTABLE",
      "data": {
        "start": 13.02,
        "end": 13.17,
        "confidence": 0.68,
        "text": "There",
        "offset": 0,
        "length": 5,
        "key": "1mgy3gm"
      }
    },
....
}
```

The good news, is that given the blocks and the entityRanges, we can programmatically generate the entityMap. Which means you don't have to worry about creating the entityMap when making an adapter.
