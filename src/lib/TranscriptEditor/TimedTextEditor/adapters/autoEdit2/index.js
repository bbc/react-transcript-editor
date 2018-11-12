/**
 * Convert autoEdit2 Json
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

const groupWordsInParagraphs = words => {
  const results = [];
  let paragraph = { words: [], text: [] };

  words.forEach(word => {
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

const autoEdit2ToDraft = bbcKaldiJson => {
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

  wordsByParagraphs.forEach(paragraph => {
    const draftJsContentBlockParagraph = {
      text: paragraph.text.join(' '),
      type: 'paragraph',
      data: {
        speaker: 'TBC'
      },
      // the entities as ranges are each word in the space-joined text, 
      // so it needs to be compute for each the offset from the beginning of the paragraph and the length
      entityRanges: generateEntitiesRanges(paragraph.words)
    };
    // console.log(JSON.stringify(draftJsContentBlockParagraph,null,2))
    results.push(draftJsContentBlockParagraph);
  });

  return results;
};

export default autoEdit2ToDraft;
