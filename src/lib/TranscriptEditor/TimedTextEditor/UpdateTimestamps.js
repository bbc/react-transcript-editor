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

const updateTimestamps = (currentContent, originalContent) => {
  const currentText = convertContentToText(currentContent);
  const originalText = convertContentToText(originalContent);

  const lineModeDiff = diffLineMode(originalText.join('\n') + '\n', currentText.join('\n') + '\n');
  const entities = originalContent.entityMap;

  var currentTextIdx = 0;
  var entityIdx = 0;
  var diffIdx = 0;

  var newEntities = [];

  while (diffIdx < lineModeDiff.length) {
    const diffEntry = lineModeDiff[diffIdx];
    const nextDiffEntry = lineModeDiff[diffIdx + 1] || -1;
    const diffType = diffEntry[0];
    const numberOfWords = (diffEntry[1].match(/\n/g) || []).length;

    if (diffType === 0) {
      for (var wordItr = 0; wordItr < numberOfWords; wordItr++) {
        const word = currentText[currentTextIdx++];
        const entity = entities[entityIdx++].data;

        const newEntity = createEntity(entity.start, entity.end, 0.0, word, -1);
        newEntities.push(newEntity);
      }
    } else if (diffType === -1) {
      if (nextDiffEntry !== -1 && nextDiffEntry[0] === 1) {
        const entityStart = entities[entityIdx].data.start;
        const entityEnd = entities[entityIdx + numberOfWords - 1].data.end;

        const numberOfReplacements = (nextDiffEntry[1].match(/\n/g) || []).length;

        for (var wordItr = 0; wordItr < numberOfReplacements; wordItr++) {
          const word = currentText[currentTextIdx++];

          const newEntity = createEntity(entityStart, entityEnd, 0.0, word, -1);
          newEntities.push(newEntity);
        }
        entityIdx += numberOfWords;
        diffIdx++;
      } else {
        entityIdx += numberOfWords;
      }
    } else if (diffType === 1) {
      for (var wordItr = 0; wordItr < numberOfWords; wordItr++) {
        const word = currentText[currentTextIdx++];
        const entity = entities[entityIdx].data;

        const newEntity = createEntity(entity.start, entity.end, 0.0, word, -1);
        newEntities.push(newEntity);
      }
    }
    diffIdx ++;
  }

  var updatedBlockArray = [];
  var totalWords = 0;

  for (var blockIdx in currentContent.blocks) {
    const block = currentContent.blocks[blockIdx];
    const wordsInBlock = (block.text.match(/\S+/g) || []).length;
    const blockEntites = newEntities.slice(totalWords, totalWords + wordsInBlock);

    const updatedBlock = {
      text: blockEntites.map((entry) => entry.punct).join(' '),
      type: 'paragraph',
      data: {
        speaker: block.data.speaker,
        words: blockEntites,
        start: blockEntites[0].start
      },
      entityRanges: generateEntitiesRanges(blockEntites, 'punct'),
    };

    updatedBlockArray.push(updatedBlock);
    totalWords += wordsInBlock;
  }

  const updatedContent = { blocks: updatedBlockArray, entityMap: createEntityMap(updatedBlockArray) };

  return updatedContent;
};

export default updateTimestamps;