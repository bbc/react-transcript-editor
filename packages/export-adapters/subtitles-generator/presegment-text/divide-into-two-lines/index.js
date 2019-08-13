'use strict';
import removeSpaceAtBeginningOfLine from '../util/remove-space-at-beginning-of-line.js';

function divideIntoTwoLines(text) {
  var lines = text.split('\n');

  var counter = 0;

  var result = lines.map((l) => {
    if (l === '') {
      return l;
    } else {
      if (counter === 0) {
        counter += 1;
        if (l[l.length - 1][0] === '.') {
          return l + '\n\n';
        }

        return l + '\n';
      } else if (counter === 1) {
        counter = 0;

        return l + '\n\n';
      }
    }
  });

  result = removeSpaceAtBeginningOfLine(result);
  // remove empty lines from list to avoid unwanted space a beginning of line
  result = result.filter(line => line.length !== 0);

  result = result.join('').trim();

  return result;
}

export default divideIntoTwoLines;