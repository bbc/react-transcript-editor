/**
 * Convert Platform STT transcript json format to DraftJS
 */
import generateEntitiesRanges from '../generate-entities-ranges';
import groupWordsInParagraphsBySpeakers from "../digital-paper-edit/group-words-by-speakers";

/**
 * groups words list from kaldi transcript based on punctuation.
 * @param {array} words - array of words objects from kaldi transcript
 */
const groupWordsInParagraphs = (words) => {
  const results = [];
  let paragraph = { words: [], text: [] };

  words.forEach((word) => {
    paragraph.words.push(word);
    paragraph.text.push(word.text);

    // if word contains punctuation
    if (/[.?!]/.test(word.text)) {
      paragraph.text = paragraph.text.join(' ');
      results.push(paragraph);
      // reset paragraph
      paragraph = { words: [], text: [] };
    }
  });

  return results;
};

const generateDraftJsContentBlock = (paragraph) => {
  const { words, text, speaker } = paragraph;
  const start = words.length > 0 ? words[0].start : 0;

  return {
    text: text,
    type: 'paragraph',
    data: {
      speaker: speaker,
      words: words,
      start: start,
    },
    // the entities as ranges are each word in the space-joined text,
    // so it needs to be compute for each the offset from the beginning of the paragraph and the length
    entityRanges: generateEntitiesRanges(words, 'text'), // wordAttributeName
  };
};

const getSentences = (items) => {
  const fullStopIndices = items
    .filter(item => item.type === 'punct' && item.alternatives[0].content === '.')
    .map(item => items.indexOf(item));

  const { sentences } = fullStopIndices.reduce(
    (accumulator, fullStopIndex) => {
      const startWordIndex = accumulator.startWordIndex;
      const endWordIndex = fullStopIndex + 1;

      accumulator.sentences.push(items.slice(startWordIndex, endWordIndex));
      accumulator.startWordIndex = endWordIndex;

      return accumulator;
    },
    { sentences: [], startWordIndex: 0 },
  );

  return sentences;
};

const punctuateWords = (items) => {
  const words = JSON.parse(JSON.stringify(items));

  words
    .filter(word => word.type === 'punct')
    .forEach((punct) => {
      const punctIndex = words.indexOf(punct);
      const previousWordIndex = punctIndex - 1;

      // take out previousWord and punct from words
      const previousWord = words.splice(previousWordIndex, 2)[0];
      previousWord.alternatives[0].content += punct.alternatives[0].content;

      // reinsert previousWord
      words.splice(previousWordIndex, 0, previousWord);
    });

  return words;
};

const formatWord = word => ({
  start: parseFloat(word.start),
  end: parseFloat(word.end),
  text: word.alternatives[0].content,
});

const generateParagraph = (items, index) => {
  const words = punctuateWords(items).map(item => formatWord(item));

  const firstWord = words[0];
  const lastWord = words[words.length - 1];

  return {
    id: index,
    start: parseFloat(firstWord.start),
    end: parseFloat(lastWord.end),
    speaker: `TBC - ${ index }`,
    words,
    text: words.map(w => w.text).join(' '),
  };
};

const psttToDraft = (psttJson) => {
  const { items, transcript } = psttJson.transcript;

  const sentences = getSentences(items);
  const grouped = sentences.reduce(
    (transcript, sentence, i) => {
      const grouped = generateParagraph(sentence, i);
      transcript.grouped.push(grouped);
      const { words, ...paragraph } = grouped;
      words.forEach((w, i) => (w.id = i + transcript.words.length));
      transcript.words = transcript.words.concat(words);
      transcript.paragraphs.push(paragraph);

      return transcript;
    },
    { paragraphs: [], words: [], grouped: [] },
  );

  let wordsByParagraphs = [];

  const { words, paragraphs } = grouped;

  if (!paragraphs) {
    wordsByParagraphs = groupWordsInParagraphs(words);
  } else {
    wordsByParagraphs = groupWordsInParagraphsBySpeakers(words, paragraphs);
  }

  const results = wordsByParagraphs.map((paragraph, i) => {
    if (!paragraph.speaker) {
      paragraph.speaker = `TBC ${ i }`;
    }

    return generateDraftJsContentBlock(paragraph);
  });

  console.log(results);

  return results;
};

export default psttToDraft;
