import textSegmentation from './text-segmentation/index.js';
import addLineBreakBetweenSentences from './line-break-between-sentences/index.js';
import foldWords from './fold/index.js';
import divideIntoTwoLines from './divide-into-two-lines/index.js';

/**
 * Takes in array of word object,
 *  and returns string containing all the text
 * @param {array} words - Words
 */
function getTextFromWordsList(words) {
  return words.map((word) => {return word.text;}).join(' ');
}

/**
 *
 * @param {*} textInput - can be either plain text string or an array of word objects
 */
function preSegmentText(textInput, tmpNumberOfCharPerLine = 35) {
  let text = textInput;
  if (typeof textInput === 'object') {
    text = getTextFromWordsList(textInput);
  }
  const segmentedText = textSegmentation(text);
  // - 2.Line brek between stentences
  const textWithLineBreakBetweenSentences = addLineBreakBetweenSentences(segmentedText);
  // - 3.Fold char limit per line
  const foldedText = foldWords(textWithLineBreakBetweenSentences, tmpNumberOfCharPerLine);
  // - 4.Divide into two lines
  // console.log(foldedText)
  const textDividedIntoTwoLines = divideIntoTwoLines(foldedText);

  return textDividedIntoTwoLines;
}

export {
  preSegmentText,
  getTextFromWordsList
};

export default preSegmentText;