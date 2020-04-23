/**
 * Convert Digital Paper Edit transcript json format to DraftJS
 * More details see
 * https://github.com/bbc/digital-paper-edit
 */
import generateEntitiesRanges from '../generate-entities-ranges';
import groupWordsInParagraphsBySpeakers from './group-words-by-speakers';
/**
 * groups words list from kaldi transcript based on punctuation.
 * @todo To be more accurate, should introduce an honorifics library to do the splitting of the words.
 * @param {array} words - array of words opbjects from kaldi transcript
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

const digitalPaperEditToDraft = (digitalPaperEditTranscriptJson) => {
  let wordsByParagraphs = [];

  const { words, paragraphs } = digitalPaperEditTranscriptJson;

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

  return results;
};

export default digitalPaperEditToDraft;
