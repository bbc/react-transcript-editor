import generateEntitiesRanges from '../generate-entities-ranges/index.js';


/**
 * Helper function to generate draft.js entities,
 * see unit test for example data structure
 * it adds offset and length to recognise word in draftjs
 */

/**
 *  @param {json} words  - List of words
 *  @param {string} wordAttributeName - eg 'punct' or 'text' or etc.
 * attribute for the word object containing the text. eg word ={ punct:'helo', ... }
 *  or eg word ={ text:'helo', ... }
 */

const getBestAlternativeForWord = (word) => {
  const alternatives = word.alternatives;
  //return alternatives.reduce();
  if (/punctuation/.test(word.type)) {
    return Object.assign(word.alternatives[0],{confidence: 1}); //Transcribe doesn't provide a confidence for punctuation
  }
  const wordWithHighestConfidence = word.alternatives.reduce(function(prev, current) {
    return (parseFloat(prev.confidence) > parseFloat(current.confidence)) ? prev : current
  })
  return wordWithHighestConfidence;
}

/**
Normalizes words so they can be used in
 the generic amazonTranscribeToDraft() method
**/

const normalizedWord = (currentWord, previousWord) => {
  const bestAlternative = getBestAlternativeForWord(currentWord);
  return {
    start: /punctuation/.test(currentWord.type) ? (parseFloat(previousWord.end_time) + 0.05).toFixed(2) : parseFloat(currentWord.start_time),
    end: /punctuation/.test(currentWord.type) ? (parseFloat(previousWord.start_time) + 0.06).toFixed(2) : parseFloat(currentWord.end_time),
    text: bestAlternative.content,
    confidence: parseFloat(bestAlternative.confidence)
  }
}

/**
 * groups words list from kaldi transcript based on punctuation.
 * @todo To be more accurate, should introduce an honorifics library to do the splitting of the words.
 * @param {array} words - array of words opbjects from kaldi transcript
 */

const groupWordsInParagraphs = (words) => {
  const results = [];
  let paragraph = {
    words: [],
    text: []
  };
  words.forEach((word, index) => {
    // if word type is punctuation
    const content = word.alternatives[0].content;
    let previousWord = {};
    if (word.type === 'punctuation' && /[.?!]/.test(content)) {
      previousWord = words[index - 1]; //assuming here the very first word is never punctuation
      paragraph.words.push(normalizedWord(word, previousWord));
      paragraph.text.push(content);
      results.push(paragraph);
      // reset paragraph
      paragraph = {
        words: [],
        text: []
      };
    } else {
      paragraph.words.push(normalizedWord(word, previousWord));
      paragraph.text.push(content);
    }
  });

  return results;
};

const amazonTranscribeToDraft = (amazonTranscribeJson) => {
  const results = [];
  const tmpWords = amazonTranscribeJson.results.items;

  const wordsByParagraphs = groupWordsInParagraphs(tmpWords);
  wordsByParagraphs.forEach((paragraph, i) => {
    const draftJsContentBlockParagraph = {
      text: paragraph.text.join(' '),
      type: 'paragraph',
      data: {
        speaker: `TBC ${ i }`,
        words: paragraph.words,
        start: parseFloat(paragraph.words[0].start)
      },
      // the entities as ranges are each word in the space-joined text,
      // so it needs to be compute for each the offset from the beginning of the paragraph and the length
      entityRanges: generateEntitiesRanges(paragraph.words, 'text'), // wordAttributeName
    };
    // console.log(JSON.stringify(draftJsContentBlockParagraph,null,2))
    results.push(draftJsContentBlockParagraph);
  });
  return results;
};

export default amazonTranscribeToDraft;
