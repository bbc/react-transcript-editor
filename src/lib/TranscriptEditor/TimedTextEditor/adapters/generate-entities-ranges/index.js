/**
 * Helper function to generate draft.js entities, 
 * see unit test for example data structure
 * it adds offset and length to recognise word in draftjs
 */
const generateEntitiesRanges = (words) => {
    let position = 0;
    return words.map((word) => {
         const result =  {
          start: word.start,
          end: word.end,
          confidence: word.confidence,
          text: word.punct,
          offset: position,
          length: word.punct.length,
          key: Math.random()
            .toString(36)
            .substring(6)
          }
          // increase position counter - to determine word offset in paragraph
          position = position + word.punct.length + 1;

          return result;
      })
} 

export default generateEntitiesRanges;