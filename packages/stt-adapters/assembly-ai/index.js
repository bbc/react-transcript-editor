import generateEntitiesRanges from '../generate-entities-ranges/index.js';

function convertMillisecondToSecond(millisecond) {
  var second = millisecond / 1000;

  return second;
}

function reorganisedWords(words) {
  return words.map((sw, index) => {
    return {
      index: index,
      text: sw.text,
      speaker: sw.speaker,
      start: parseFloat(convertMillisecondToSecond(sw.start)),
      end: parseFloat(convertMillisecondToSecond(sw.end)),
      confidence: sw.confidence
    };
  });
}

const groupWordsInParagraphs = (words, maxParagraphWords) => {
  const results = [];
  const items = [];
  let paragraph = { words: [], text: [], speaker: '' };
  let sentenceEnd = false;

  words.forEach((word, index) => {
    // if speaker changes
    if (index === 0) {
      paragraph.speaker = word.speaker;
    } else if (paragraph.speaker !== word.speaker || (paragraph.words.length > maxParagraphWords && sentenceEnd)) {
      items.push(paragraph);
      paragraph = { words: [], text: [], speaker: word.speaker  };
    }
    paragraph.words.push(word);
    paragraph.text.push(word.text);
    sentenceEnd = /[.?!]/.test(word.punct) ? true : false;
  });
  items.push(paragraph);
  items.forEach((paragraph) => {
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
      entityRanges: generateEntitiesRanges(paragraph.words, 'text'), // wordAttributeName
    };
    results.push(draftJsContentBlockParagraph);
  });

  return results;
};

const convert = (data) => {
  const { words } = data;
  const wordsReorged = reorganisedWords(words);
  const paragraphs = groupWordsInParagraphs(wordsReorged, 250);
  return paragraphs;
};

export default convert;