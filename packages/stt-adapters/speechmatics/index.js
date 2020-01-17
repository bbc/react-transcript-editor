/**
 *  Convert Speechmatics Json to DraftJs
 *  see `sample` folder for example of input and output as well as `example-usage.js`
 */

import generateEntitiesRanges from '../generate-entities-ranges/index.js';

/**
 * Determines the speaker of a paragraph by comparing the start time of the paragraph with
 * the speaker times.
 * @param {float} start - Starting point of paragraph
 * @param {array} speakers - list of all speakers with start and end time
 */
const getSpeaker = (start, speakers) => {
  for (var speakerIdx in speakers) {
    const speaker = speakers[speakerIdx];
    const segmentStart = parseFloat(start);
    if (segmentStart >= speaker.start & segmentStart < speaker.end) {
      return speaker.name;
    }
  }

  return 'UNK';
};

/**
 * groups words list from speechmatics based on speaker change and paragraph length.
 * @param {array} words - array of words objects from speechmatics transcript
 * @param {array} speakers - array of speaker objects from speechmatics transcript
 * @param {int} words - number of words which trigger a paragraph break
 */
const groupWordsInParagraphs = (words, speakers, maxParagraphWords) => {
  const results = [];
  let paragraph = { words: [], text: [], speaker: '' };
  let oldSpeaker = getSpeaker(words[0].start, speakers);
  let newSpeaker;
  let sentenceEnd = false;

  words.forEach((word) => {
    newSpeaker = getSpeaker(word.start, speakers);
    // if speaker changes
    if (newSpeaker !== oldSpeaker || (paragraph.words.length > maxParagraphWords && sentenceEnd)) {
      paragraph.speaker = oldSpeaker;
      results.push(paragraph);
      oldSpeaker = newSpeaker;
      // reset paragraph
      paragraph = { words: [], text: [] };
    }
    paragraph.words.push(word);
    paragraph.text.push(word.punct);
    sentenceEnd = /[.?!]/.test(word.punct) ? true : false;
  });

  paragraph.speaker = oldSpeaker;
  results.push(paragraph);

  return results;
};

/**
 * Speechmatics treats punctuation as own words. This function merges punctuations with
 * the pevious word and adjusts the total duration of the word.
 * @param {array} words - array of words objects from speechmatics transcript
 */
const curatePunctuation = (words) => {
  const curatedWords = [];
  words.forEach((word) => {
    if (/[.?!]/.test(word.name) && word.name.length == 1 && curatedWords.length > 0) {
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
      start: parseFloat(element.time),
      end: (parseFloat(element.time) + parseFloat(element.duration)),
      name: element.name,
    });
  });

  const wordsByParagraphs = groupWordsInParagraphs(tmpWords, tmpSpeakers, 150);

  wordsByParagraphs.forEach((paragraph) => {
    const paragraphStart = paragraph.words[0].start;
    const draftJsContentBlockParagraph = {
      text: paragraph.text.join(' '),
      type: 'paragraph',
      data: {
        speaker: paragraph.speaker,
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
