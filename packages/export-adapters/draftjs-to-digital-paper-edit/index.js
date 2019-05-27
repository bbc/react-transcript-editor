/**
 * Convert DraftJS to Digital Paper Edit format
 * More details see
 * https://github.com/bbc/digital-paper-edit
 */
export default (blockData) => {
  const result = { words: [], paragraphs: [] };

  blockData.blocks.forEach((block, index) => {
    if (block.data.words !== undefined) {
      // TODO: make sure that when restoring timecodes text attribute in block word data
      // should be updated as well
      const tmpParagraph = {
        id: index,
        start: block.data.words[0].start, //block.data.start,
        end: block.data.words[block.data.words.length - 1].end,
        speaker: block.data.speaker
      };
      result.paragraphs.push(tmpParagraph);
      // using data within a block to get words info
      const tmpWords = block.data.words.map((word) => {
        const tmpWord = {
          id: word.index,
          start: word.start,
          end: word.end,
          text: null
        };
        // TODO: need to normalise various stt adapters
        // so that when they create draftJs json, word text attribute
        // has got consistent naming. `text` and not `punct` or `word`.
        if (word.text) {
          tmpWord.text = word.text;
        }
        else if (word.punct) {
          tmpWord.text = word.punct;
        }
        else if (word.word) {
          tmpWord.text = word.punct;
        }

        return tmpWord;
      });
      // flattening the list of words
      result.words = result.words.concat(tmpWords);
    }
  });

  return result;
};
