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


function bbcKaldiToDraft(bbcKaldiJson){
    let results = [];
   let wordsByParagraphs = groupWordsInParagraphs(bbcKaldiJson.retval.words);
   wordsByParagraphs.forEach((paragraph)=>{
        let draftJsContentBlockParagraph = {
            text: paragraph.text.join(' '),
            type: 'paragraph',
            data: {
            speaker: 'TBC',
            },
            entityRanges: []
        }
        results.push(draftJsContentBlockParagraph);
    })


    return results;
}

/**
 * groups words list from kaldi transcript based on punctuation.
 * @todo To be more accurate, should introduce an honorifics library to do the splitting of the words.
 * @param {array} words - array of words opbjects from kaldi transcript
 */ 
function groupWordsInParagraphs(words){
    let results = [];
    let paragraph = {words:[], text:[]};
    words.forEach((word) => {
        // if word contains punctuation
        if(/[,.?!]/.test(word.punct)){
            paragraph.words.push(word);
            paragraph.text.push(word.punct);
            results.push(paragraph);
            // reset paragraph 
            paragraph = {words:[], text:[]};
        }else{
            paragraph.words.push(word);
            paragraph.text.push(word.punct);
        }
    });
    return results
}

 module.exports = bbcKaldiToDraft;