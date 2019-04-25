import groupWordsInParagraphsBySpeakers from './group-words-by-speakers';

import digitalPaperEditTranscript from './sample/digitalPaperEdit.sample.json';

const segmentation = digitalPaperEditTranscript.paragraphs;
const words = digitalPaperEditTranscript.words;

describe('groupWordsInParagraphsBySpeakers', () => {
  /**
     * Hard to test if the segmentation algo it's working properly
     * But one basic test for now is to test there is the same number of words
     * In the result.
     */
  it('Expect same word count in results', ( ) => {

    const wordsByParagraphs = groupWordsInParagraphsBySpeakers(words, segmentation);

    const resultWordCount = wordsByParagraphs.reduce(reduceFunction, 0);

    function reduceFunction(total, currentParagraph) {
      return total + currentParagraph.words.length;
    };

    expect(resultWordCount).toBe(words.length);
  });
});
