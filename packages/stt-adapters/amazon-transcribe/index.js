/**
 * Converts AWS Transcribe Json to DraftJs
 * see `sample` folder for example of input and output as well as `example-usage.js`
 */

import generateEntitiesRanges from '../generate-entities-ranges/index.js';
import { groupWordsBySpeaker } from './group-words-by-speakers';

export const stripLeadingSpace = word => {
  return word.replace(/^\s/, '');
};

/**
 *  @param {json} words  - List of words
 *  @param {string} wordAttributeName - eg 'punct' or 'text' or etc.
 * attribute for the word object containing the text. eg word ={ punct:'helo', ... }
 *  or eg word ={ text:'helo', ... }
 */
export const getBestAlternativeForWord = word => {
  if (/punctuation/.test(word.type)) {
    return Object.assign(word.alternatives[0], { confidence: 1 }); //Transcribe doesn't provide a confidence for punctuation
  }
  const wordWithHighestConfidence = word.alternatives.reduce(function(
    prev,
    current
  ) {
    return parseFloat(prev.confidence) > parseFloat(current.confidence)
      ? prev
      : current;
  });

  return wordWithHighestConfidence;
};

/**
 * Normalizes words so they can be used in
 * the generic generateEntitiesRanges() method
 **/
const normalizeWord = currentWord => {
  const bestAlternative = getBestAlternativeForWord(currentWord);

  return {
    start: parseFloat(currentWord.start_time),
    end: parseFloat(currentWord.end_time),
    text: bestAlternative.content,
    confidence: parseFloat(bestAlternative.confidence)
  };
};

export const appendPunctuationToPreviousWord = (punctuation, previousWord) => {
  const punctuationContent = punctuation.alternatives[0].content;

  return {
    ...previousWord,
    alternatives: previousWord.alternatives.map(w => ({
      ...w,
      content: w.content + stripLeadingSpace(punctuationContent)
    }))
  };
};

export const mapPunctuationItemsToWords = words => {
  const itemsToRemove = [];
  const dirtyArray = words.map((word, index) => {
    let previousWord = {};
    if (word.type === 'punctuation') {
      itemsToRemove.push(index - 1);
      previousWord = words[index - 1];

      return appendPunctuationToPreviousWord(word, previousWord);
    } else {
      return word;
    }
  });

  return dirtyArray.filter((item, index) => {
    return !itemsToRemove.includes(index);
  });
};

/**
 * groups words list from amazon transcribe transcript based on punctuation.
 * @todo To be more accurate, should introduce an honorifics library to do the splitting of the words.
 * @param {array} words - array of words objects from kaldi transcript
 */
const groupWordsInParagraphs = words => {
  const results = [];
  let paragraph = {
    words: [],
    text: []
  };
  words.forEach((word) => {
    const content = getBestAlternativeForWord(word).content;
    const normalizedWord = normalizeWord(word);
    if (/[.?!]/.test(content)) {
      paragraph.words.push(normalizedWord);
      paragraph.text.push(content);
      results.push(paragraph);
      // reset paragraph
      paragraph = { words: [], text: [] };
    } else {
      paragraph.words.push(normalizedWord);
      paragraph.text.push(content);
    }
  });

  return results;
};

const groupSpeakerWordsInParagraphs = (words, speakerLabels) => {
  const wordsBySpeaker = groupWordsBySpeaker(words, speakerLabels);

  return wordsBySpeaker.map((speakerGroup) => {
    return {
      words: speakerGroup.words.map(normalizeWord),
      text: speakerGroup.words.map((w) => getBestAlternativeForWord(w).content),
      speaker: speakerGroup.speaker
    };
  });
};

const amazonTranscribeToDraft = amazonTranscribeJson => {
  const results = [];
  const tmpWords = amazonTranscribeJson.results.items;
  const speakerLabels = amazonTranscribeJson.results.speaker_labels;
  const wordsWithRemappedPunctuation = mapPunctuationItemsToWords(tmpWords);
  const speakerSegmentation = typeof(speakerLabels) != 'undefined';

  const wordsByParagraphs = speakerSegmentation ?
    groupSpeakerWordsInParagraphs(wordsWithRemappedPunctuation, speakerLabels) :
    groupWordsInParagraphs(
      wordsWithRemappedPunctuation
    );

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

export default amazonTranscribeToDraft;
