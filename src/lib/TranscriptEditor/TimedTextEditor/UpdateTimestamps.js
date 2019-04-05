import generateEntitiesRanges from '../../Util/adapters/generate-entities-ranges/index.js';
import { createEntityMap } from '../../Util/adapters/index.js';
import DiffMatchPatch from 'diff-match-patch';

const convertContentToText = (content) => {
  var text = [];

  for (var blockIdx in content.blocks) {
    const block = content.blocks[blockIdx];
    const blockArray = block.text.match(/\S+/g) || [];
    text = text.concat(blockArray);
  }

  return (text);
};

const createEntity = (start, end, confidence, word, wordIdx) => {
  return ({
    start: start,
    end: end,
    confidence: confidence,
    word: word.toLowerCase().replace(/[.?!]/g, ''),
    punct: word,
    index: wordIdx,
  });
};

const realignTimestamps = (differences, currentContent, referenceContent) => {

  var diffIdx = 0;
  var entityIdx = 0;

  const entities = referenceContent.entityMap;
  const results = [];

  for (var blockIdx in currentContent.blocks) {
    const block = currentContent.blocks[blockIdx];
    const words = block.text.match(/\S+/g) || [];

    var substitutionStart = null;
    var wordMeta = null;
    var entity = null;

    if (words.length > 0) {
      var wordMetaArray = [];
      var wordIdx = 0;

      while (wordIdx < words.length) {
        const word = words[wordIdx];
        const diffType = differences[diffIdx];
        diffIdx++;
        if (diffType === 'm' || diffType === 's') {
          entity = entities[entityIdx].data;
          wordMeta = createEntity(entity.start, entity.end, entity.confidence, word, wordIdx);
          wordIdx++;
          entityIdx++;
          wordMetaArray.push(wordMeta);
        } else if (diffType === 'ss') {
          substitutionStart = entities[entityIdx].data.start;
          entityIdx++;
        } else if (diffType === 'se') {
          wordMeta = createEntity(substitutionStart, entities[entityIdx].data.end, 0.0, word, wordIdx);
          wordIdx++;
          entityIdx++;
          wordMetaArray.push(wordMeta);
        } else if (diffType === 'd' || diffType === 'si') {
          entityIdx++;
        } else if (diffType === 'i') {
          entity = entities[entityIdx].data;
          wordMeta = createEntity(entity.start, entity.end, entity.confidence, word, wordIdx);
          wordIdx++;
          wordMetaArray.push(wordMeta);
        } else {
          console.log('Found illegal symbol ' + diffType);
          wordIdx++;
        }
      }

      const updatedBlock = {
        text: wordMetaArray.map((entry) => entry.punct).join(' '),
        type: 'paragraph',
        data: {
          speaker: 'speaker',
          words: wordMetaArray,
          start: wordMetaArray[0].start
        },
        entityRanges: generateEntitiesRanges(wordMetaArray, 'punct'),
      };

      results.push(updatedBlock);
    }
  }

  const updatedContent = { blocks: results, entityMap: createEntityMap(results) };

  return updatedContent;
};

// https://github.com/google/diff-match-patch/wiki/Line-or-Word-Diffs
const diffLineMode = (text1, text2) => {
  var dmp = new DiffMatchPatch();
  var a = dmp.diff_linesToChars_(text1, text2);
  var lineText1 = a.chars1;
  var lineText2 = a.chars2;
  var lineArray = a.lineArray;
  var diffs = dmp.diff_main(lineText1, lineText2, false);
  dmp.diff_charsToLines_(diffs, lineArray);

  return diffs;
};

const diff = (text1, text2) => {

  var diffArray = [];
  var arrayIdx = 0;

  const lineModeDiff = diffLineMode(text2.join('\n') + '\n', text1.join('\n') + '\n');
  while (arrayIdx < lineModeDiff.length) {
    const diffEntry = lineModeDiff[arrayIdx];
    const numberOfWords = (diffEntry[1].match(/\n/g) || []).length;
    var symbol = '-';
    if (diffEntry[0] === 0) {
      symbol = 'm';
    } else if (diffEntry[0] === 1) {
      symbol = 'i';
    } else if (diffEntry[0] === -1) {
      if (arrayIdx < lineModeDiff.length - 1 && lineModeDiff[arrayIdx + 1][0] === 1) {
        symbol = 'ss';
        arrayIdx++; // Increase an additional time to skip insert/delete syntax for substitution
      } else {
        symbol = 'd';
      }
    }
    for (var i = 0; i < numberOfWords; i++) {
      if (symbol === 'ss' && numberOfWords === 1) {
        symbol = 's';
      }
      diffArray.push(symbol);
      if (symbol === 'ss') {
        symbol = 'si';
      }
      if (symbol === 'si' && i === (numberOfWords - 2)) {
        symbol = 'se';
      }
    };
    arrayIdx++;
  }

  return diffArray;
};

const updateTimestamps = (currentContent, originalContent) => {
  const currentText = convertContentToText(currentContent);
  const originalText = convertContentToText(originalContent);

  const diffArray = diff(currentText, originalText);
  const updatedContent = realignTimestamps(diffArray, currentContent, originalContent);

  return (updatedContent);
};

export default updateTimestamps;