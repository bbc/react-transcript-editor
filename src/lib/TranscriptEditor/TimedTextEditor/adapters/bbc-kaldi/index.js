/**
 * Convert BBC Kaldi json
 ```
 {
    "action": "audio-transcribe",
    "retval": {
      "status": true,
      "wonid": "octo:2692ea33-d595-41d8-bfd5-aa7f2d2f89ee",
      "punct": "There is a day. About ten years ago when  ...",
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
```
 * 
 * into 
 * 
 ```
 const blocks = [
        {
            text: 'Hello',
            type: 'paragraph',
            data: {
            speaker: 'Foo',
            },
            entityRanges: [],
        },
        {
            text: 'World',
            type: 'paragraph',
            data: {
            speaker: 'Bar',
            },
            entityRanges: [],
        },
        ];
```
 * 
 */

 // using require, because of testing outside of React app
const kaldiTedTalkTranscript = require('../../../../../sample-data/KateDarling_2018S-bbc-kaldi.json');

function bbcKaldiToDraft(bbcKaldiJson){
    let results = [];
   let wordsByParagraphs = groupWordsInParagraphs(bbcKaldiJson.retval.words);
    // bbcKaldiJson.retval.words.forEach((word)=>{
    //     let draftJsContentBlockParagraph = {
    //         text: word.punct,
    //         type: 'paragraph',
    //         data: {
    //         speaker: 'TBC',
    //         },
    //         entityRanges: []
    //     }
    //     results.push(draftJsContentBlockParagraph);
    // })


    return wordsByParagraphs;
}

function groupWordsInParagraphs(words){
    let results = [];
    let paragraph = [];
    words.forEach((word) => {
        if(/[,.?!]/.test(word.punct)){
            paragraph.push(word);
            results.push(paragraph);
            paragraph=[];
        }
        else{
            paragraph.push(word);
        }

    });
    return results
}


//////testing
let result = bbcKaldiToDraft(kaldiTedTalkTranscript);

 console.log(result[result.length-1]);

 module.exports = bbcKaldiToDraft;