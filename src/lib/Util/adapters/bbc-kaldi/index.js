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

import generateEntitiesRanges from '../generate-entities-ranges/index.js';

/**
 * groups words list from kaldi transcript based on punctuation.
 * @todo To be more accurate, should introduce an honorifics library to do the splitting of the words.
 * @param {array} words - array of words opbjects from kaldi transcript
 */

const groupWordsInParagraphs = (words) => {
  const results = [];
  let paragraph = { words: [], text: [] };

  words.forEach((word) => {
    // if word contains punctuation
    if (/[.?!]/.test(word.punct)) {
      paragraph.words.push(word);
      paragraph.text.push(word.punct);
      results.push(paragraph);
      // reset paragraph
      paragraph = { words: [], text: [] };
    } else {
      paragraph.words.push(word);
      paragraph.text.push(word.punct);
    }
  });

  return results;
};

const bbcKaldiToDraft = (bbcKaldiJson) => {
  const results = [];
  let tmpWords;

  // BBC Octo Labs API Response wraps Kaldi response around retval,
  // while kaldi contains word attribute at root
  if (bbcKaldiJson.retval !== undefined) {
    tmpWords = bbcKaldiJson.retval.words;
  } else {
    tmpWords = bbcKaldiJson.words;
  }

  const wordsByParagraphs = groupWordsInParagraphs(tmpWords);

  wordsByParagraphs.forEach((paragraph, i) => {
    const draftJsContentBlockParagraph = {
      text: paragraph.text.join(' '),
      type: 'paragraph',
      data: {
        speaker: `TBC ${ i }`,
        words: paragraph.words,
        start: paragraph.words[0].start
      },
      // the entities as ranges are each word in the space-joined text,
      // so it needs to be compute for each the offset from the beginning of the paragraph and the length
      entityRanges: generateEntitiesRanges(paragraph.words, 'punct'), // wordAttributeName
    };
    // console.log(JSON.stringify(draftJsContentBlockParagraph,null,2))
    results.push(draftJsContentBlockParagraph);
  });

  return results;
};

export default bbcKaldiToDraft;
