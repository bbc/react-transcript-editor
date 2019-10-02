'use strict';

function addLineBreakBetweenSentences(text) {
  return text.replace(/\n/g, '\n\n');
}

export default addLineBreakBetweenSentences;