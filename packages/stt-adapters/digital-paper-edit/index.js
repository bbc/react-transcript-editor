/**
 * Convert Digital Paper Edit transcript json format to DraftJS
 * More details see
 * https://github.com/bbc/digital-paper-edit
 */
import generateEntitiesRanges from '../generate-entities-ranges/index.js';
import groupWordsInParagraphsBySpeakers from './group-words-by-speakers.js';
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
    if (/[.?!]/.test(word.text)) {
      paragraph.words.push(word);
      paragraph.text.push(word.text);
      paragraph.text = paragraph.text.join(' ');
      results.push(paragraph);
      // reset paragraph
      paragraph = { words: [], text: [] };
    } else {
      paragraph.words.push(word);
      paragraph.text.push(word.text);
    }
  });

  return results;
};

const digitalPaperEditToDraft = (digitalPaperEditTranscriptJson) => {
  const results = [];
  let speakerSegmentation = null;
  let wordsByParagraphs = [];
  const tmpWords = digitalPaperEditTranscriptJson.words;

  if (digitalPaperEditTranscriptJson.paragraphs) {
    speakerSegmentation = digitalPaperEditTranscriptJson.paragraphs;
  }

  if (!speakerSegmentation) {
    wordsByParagraphs = groupWordsInParagraphs(tmpWords);
  } else {
    wordsByParagraphs = groupWordsInParagraphsBySpeakers(tmpWords, digitalPaperEditTranscriptJson.paragraphs );
  }

  wordsByParagraphs.forEach((paragraph, i) => {
    // if paragraph contain words
    // eg sometimes the speaker segmentation might not contain words :man-shrugging:
    if (paragraph.words[0]) {
      let speakerLabel = `TBC ${ i }`;
      if (speakerSegmentation) {
        speakerLabel = paragraph.speaker;
      }

      const draftJsContentBlockParagraph = {
        text: paragraph.text,
        type: 'paragraph',
        data: {
          speaker: speakerLabel,
          words: paragraph.words,
          start: paragraph.words[0].start
        },
        // the entities as ranges are each word in the space-joined text,
        // so it needs to be compute for each the offset from the beginning of the paragraph and the length
        entityRanges: generateEntitiesRanges(paragraph.words, 'text') // wordAttributeName
      };
      results.push(draftJsContentBlockParagraph);
    }
  });

  return results;
};

export default digitalPaperEditToDraft;
