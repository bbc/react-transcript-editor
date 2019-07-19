/**
 * Converts GCP Speech to Text Json to DraftJs
 * see `sample` folder for example of input and output as well as `example-usage.js`
 */

import generateEntitiesRanges from '../generate-entities-ranges/index.js';

const NANO_SECOND = 1000000000;

/**
 * attribute for the sentences object containing the text. eg sentences ={ punct:'helo', ... }
 *  or eg sentences ={ text:'hello', ... }
 * @param sentences
 */
export const getBestAlternativeSentence = sentences => {
  if (sentences.alternatives.length === 0) {
    return sentences[0];
  }

  const sentenceWithHighestConfidence = sentences.alternatives.reduce(function(
    prev,
    current
  ) {
    return parseFloat(prev.confidence) > parseFloat(current.confidence)
      ? prev
      : current;
  });

  return sentenceWithHighestConfidence;
};

export const trimLeadingAndTailingWhiteSpace = text => {
  return text.trim();
};

/**
 * GCP does not provide a nanosecond attribute if the word starts at 0 nanosecond
 * @param startSecond
 * @param nanoSecond
 * @returns {number}
 */
const computeTimeInSeconds = (startSecond, nanoSecond) => {

  let seconds = parseFloat(startSecond);

  if (nanoSecond !== undefined) {
    seconds = seconds + parseFloat(nanoSecond / NANO_SECOND);
  }

  return seconds;
};

/**
 * Normalizes words so they can be used in
 * the generic generateEntitiesRanges() method
 **/
const normalizeWord = (currentWord, confidence) => {

  return {
    start: computeTimeInSeconds(currentWord.startTime.seconds, currentWord.startTime.nanos),
    end: computeTimeInSeconds(currentWord.endTime.seconds, currentWord.endTime.nanos),
    text: currentWord.word,
    confidence: confidence
  };
};

/**
 * groups words list from GCP Speech to Text response.
 * @param {array} sentences - array of sentence objects from GCP STT
 */
const groupWordsInParagraphs = sentences => {
  const results = [];
  let paragraph = {
    words: [],
    text: []
  };

  sentences.forEach((sentence) => {
    const bestAlternative = getBestAlternativeSentence(sentence);
    paragraph.text.push(trimLeadingAndTailingWhiteSpace(bestAlternative.transcript));

    bestAlternative.words.forEach((word) => {
      paragraph.words.push(normalizeWord(word, bestAlternative.confidence));
    });
    results.push(paragraph);
    paragraph = { words: [], text: [] };
  });

  return results;
};

const gcpSttToDraft = gcpSttJson => {
  const results = [];
  // const speakerLabels = gcpSttJson.results[0]['alternatives'][0]['words'][0]['speakerTag']
  // let speakerSegmentation = typeof(speakerLabels) != 'undefined';

  const wordsByParagraphs = groupWordsInParagraphs(gcpSttJson.results);

  wordsByParagraphs.forEach((paragraph, i) => {
    const draftJsContentBlockParagraph = {
      text: paragraph.text.join(' '),
      type: 'paragraph',
      data: {
        speaker: paragraph.speaker ? `Speaker ${ paragraph.speaker }` : `TBC ${ i }`,
        words: paragraph.words,
        start: parseFloat(paragraph.words[0].start)
      },
      // the entities as ranges are each word in the space-joined text,
      // so it needs to be compute for each the offset from the beginning of the paragraph and the length
      entityRanges: generateEntitiesRanges(paragraph.words, 'text') // wordAttributeName
    };
    results.push(draftJsContentBlockParagraph);
  });

  return results;
};

export default gcpSttToDraft;
