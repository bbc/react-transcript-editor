/**
 * Convert autoEdit2 Json to draftJS
 * see `sample` folder for example of input and output as well as `example-usage.js`
 */

import generateEntitiesRanges from '../generate-entities-ranges/index';

/**
 * groups words list from autoEdit transcript based on punctuation.
 * @todo To be more accurate, should introduce an honorifics library to do the splitting of the words.
 * @param {array} words - array of words objects from autoEdit transcript
 */

const groupWordsInParagraphs = (autoEditText) => {
  const results = [];
  let paragraph = { words: [], text: [] };

  autoEditText.forEach((autoEditparagraph) => {
    autoEditparagraph.paragraph.forEach((autoEditLine) => {
      autoEditLine.line.forEach((word) => {
        // adjusting time reference attributes from
        // `startTime` `endTime` to `start` `end`
        // for word object
        const tmpWord = {
          text: word.text,
          start: word.startTime,
          end: word.endTime,
        };
        //  if word contains punctuation
        if (/[.?!]/.test(word.text)) {
          paragraph.words.push(tmpWord);
          paragraph.text.push(word.text);
          results.push(paragraph);
          // reset paragraph
          paragraph = { words: [], text: [] };
        } else {
          paragraph.words.push(tmpWord);
          paragraph.text.push(word.text);
        }
      });
    });
  });

  return results;
};

const autoEdit2ToDraft = (autoEdit2Json) => {
  const results = [];
  const tmpWords = autoEdit2Json.text;
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
      entityRanges: generateEntitiesRanges(paragraph.words, 'text'),
    };
    // console.log(JSON.stringify(draftJsContentBlockParagraph,null,2))
    results.push(draftJsContentBlockParagraph);
  });

  // console.log(JSON.stringify(results,null,2))
  return results;
};

export default autoEdit2ToDraft;
