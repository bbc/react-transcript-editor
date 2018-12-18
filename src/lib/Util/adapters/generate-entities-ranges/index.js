/**
 * Helper function to generate draft.js entities,
 * see unit test for example data structure
 * it adds offset and length to recognise word in draftjs
 */

/**
*  @param {json} words  - List of words
*  @param {string} wordAttributeName - eg 'punct' or 'text' or etc.
* attribute for the word object containing the text. eg word ={ punct:'helo', ... }
*  or eg word ={ text:'helo', ... }
*/
const generateEntitiesRanges = (words, wordAttributeName) => {
  let position = 0;

  return words.map((word) => {
    const result = {
      start: word.start,
      end: word.end,
      confidence: word.confidence,
      text: word[wordAttributeName],
      offset: position,
      length: word[wordAttributeName].length,
      key: Math.random()
        .toString(36)
        .substring(6),
    };
    // increase position counter - to determine word offset in paragraph
    position = position + word[wordAttributeName].length + 1;

    return result;
  });
};

export default generateEntitiesRanges;
