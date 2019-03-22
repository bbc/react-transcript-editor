/**
 *  Convert Speechmatics Json to DraftJs
 *  see `sample` folder for example of input and output as well as `example-usage.js`
 */

import generateEntitiesRanges from '../generate-entities-ranges/index.js';

/**
 * groups words list from speechmatics based on punctuation.
 * @todo To be more accurate, should introduce an honorifics library to do the splitting of the words.
 * @todo As this function is also used in the bbc-kaldi adapter, should it be refactored into its own file?
 * @param {array} words - array of words objects from speechmatics transcript
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

/**
 * Determines the speaker of a paragraph by comparing the start time of the paragraph with
 * the speaker times.
 * @param {float} start - Starting point of paragraph
 * @param {array} speakers - list of all speakers with start and end time
 */
const getSpeaker = (start, speakers) => {
  for (var speakerIdx in speakers) {
    const speaker = speakers[speakerIdx];
    if (start >= speaker.start & start < speaker.end) {
      return speaker.name;
    }
  }

  return 'UNK';
};

/**
 * Speechmatics treats punctuation as own words. This function merges punctuations with
 * the pevious word and adjusts the total duration of the word.
 * @param {array} words - array of words objects from speechmatics transcript
 */
const curatePunctuation = (words) => {
  const curatedWords = [];
  words.forEach((word) => {
    if (/[.?!]/.test(word.name)) {
      curatedWords[curatedWords.length - 1].name = curatedWords[curatedWords.length - 1].name + word.name;
      curatedWords[curatedWords.length - 1].duration = (parseFloat(curatedWords[curatedWords.length - 1].duration) + parseFloat(word.duration)).toString();
    } else {
      curatedWords.push(word);
    }
  }
  );

  return curatedWords;
};

const speechmaticsToDraft = (speechmaticsJson) => {
  const results = [];

  let tmpWords;
  tmpWords = curatePunctuation(speechmaticsJson.words);
  tmpWords = tmpWords.map((element, index) => {
    return ({
      start: element.time,
      end: (parseFloat(element.time) + parseFloat(element.duration)).toString(),
      confidence: element.confidence,
      word: element.name.toLowerCase().replace(/[.?!]/g, ''),
      punct: element.name,
      index: index,
    });
  });

  let tmpSpeakers;
  tmpSpeakers = speechmaticsJson.speakers;
  tmpSpeakers = tmpSpeakers.map((element) => {
    return ({
      start: element.time,
      end: (parseFloat(element.time) + parseFloat(element.duration)).toString(),
      name: element.name,
    });
  });

  const wordsByParagraphs = groupWordsInParagraphs(tmpWords);

  wordsByParagraphs.forEach((paragraph) => {
    const paragraphStart = paragraph.words[0].start;
    const draftJsContentBlockParagraph = {
      text: paragraph.text.join(' '),
      type: 'paragraph',
      data: {
        speaker: getSpeaker(paragraphStart, tmpSpeakers),
        words: paragraph.words,
        start: paragraphStart
      },
      // the entities as ranges are each word in the space-joined text,
      // so it needs to be compute for each the offset from the beginning of the paragraph and the length
      entityRanges: generateEntitiesRanges(paragraph.words, 'punct'), // wordAttributeName
    };
    results.push(draftJsContentBlockParagraph);
  });

  return results;
};

export default speechmaticsToDraft;
