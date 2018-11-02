# Entity ranges 

By Laurian

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