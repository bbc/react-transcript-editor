# Entity ranges 

Example of how to use of [entity ranges](https://draftjs.org/docs/advanced-topics-entities) in `draft.js` [content block](https://draftjs.org/docs/api-reference-content-block) to add word timing informations.

```json
{
  "blocks": [
    {
      "key": "56udg",
      "text": "We tried to sell this as a\ncritic and pristine and untouched.",
      "type": "paragraph",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [
        {
          "offset": 0,
          "length": 2,
          "key": 0
        },
        {
          "offset": 3,
          "length": 5,
          "key": 1
        },
        {
          "offset": 9,
          "length": 2,
          "key": 2
        },
```


block with `"text": "We tried to sell this as a\ncritic and pristine and untouched."`
would have 
```json
"entityRanges": [
       {
         "offset": 0,
         "length": 2,
         "key": 0
       }, ...
```

and entityMap would map key `0` to 

```json
"entityMap": {
   "0": {
     "type": "TOKEN",
     "mutability": "MUTABLE",
     "data": {
       "start": 1.55,
       "end": 1.7,
       "text": "We",
       "played": false,
       "offset": 0,
       "length": 2,
       "key": "74wi4hd"
     }
   },
```

> Some of that data is custom made by me like start, end (time), text, played. `draft.js` cares about offset and length and key (and type and mutability) also the data on each block is my custom data (speaker, start/end, segment/para id which is not the block key) things look weird but once you get into all makes sense.


> so I can compare original text with actual text and know that it was changed also for subtitalizer I had to move some data out of draft.js content state as I wanted the changes on that not to get on the undo stack (users can undo text changes but not paragraph timecode changes on ctrl-z)


see [`examples/subtitalizer-entities-range-example.js`](./examples/subtitalizer-entities-range-example.js) for full example code.


---
the entities as ranges are each word in the space-joined text, so it needs to be compute for each the offset from the beginning of the paragraph and the length

Example Blocks with entityRanges
```js
[
  {
    "text": "There is a day.",
    "type": "paragraph",
    "data": {
      "speaker": "TBC"
    },
    "entityRanges": [
      {
        "start": 13.02, // Custom fields
        "end": 13.17, // Custom fields
        "confidence": 0.68, // Custom fields
        "text": "There", // Custom fields - to detect what has changed
        "offset": 0,  // Required by Draft.js 
        "length": 5, //Required by Draft.js 
        "key": "ctavu0r" // can also be provided by draftjs if not provided. 
			// providing your own more flexibility 
      },
      {
        "start": 13.17,
        "end": 13.38,
        "confidence": 0.61,
        "text": "is",
        "offset": 6,
        "length": 2,
        "key": "p7ove2f"
      },
      {
        "start": 13.38,
        "end": 13.44,
        "confidence": 0.99,
        "text": "a",
        "offset": 9,
        "length": 1,
        "key": "biz4yteg"
      },
      {
        "start": 13.44,
        "end": 13.86,
        "confidence": 1,
        "text": "day.",
        "offset": 11,
        "length": 4,
        "key": "nvmzaxe"
      }
    ]
  },
```


entityMap <-- defines how to render for the content state 

Stays in sync entityRanges through the `offset` and `length` attribute.

Draftjs keeps them up to date.

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
  "dlsacke": {
    "type": "WORD",
    "mutability": "MUTABLE",
    "data": {
      "start": 13.17,
      "end": 13.38,
      "confidence": 0.61,
      "text": "is",
      "offset": 6,
      "length": 2,
      "key": "dlsacke"
    }
  },
  "zj9bj59": {
    "type": "WORD",
    "mutability": "MUTABLE",
    "data": {
      "start": 13.38,
      "end": 13.44,
      "confidence": 0.99,
      "text": "a",
      "offset": 9,
      "length": 1,
      "key": "zj9bj59"
    }
  },
  "8uvpibo": {
    "type": "WORD",
    "mutability": "MUTABLE",
    "data": {
      "start": 13.44,
      "end": 13.86,
      "confidence": 1,
      "text": "day.",
      "offset": 11,
      "length": 4,
      "key": "8uvpibo"
    }
  },
```
