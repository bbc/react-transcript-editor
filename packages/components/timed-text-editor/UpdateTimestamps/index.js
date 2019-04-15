import generateEntitiesRanges from '../../../stt-adapters/generate-entities-ranges/index.js';
import { createEntityMap } from '../../../stt-adapters/index.js';
import DiffMatchPatch from 'diff-match-patch';
import alignJSONText from './stt-align-node.js';

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

const createContentFromEntityList = (currentContent, newEntities) => {
  // Update entites to block structure.
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

  return { blocks: updatedBlockArray, entityMap: createEntityMap(updatedBlockArray) };
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

// Update timestamps usign diff-match-patch.
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
      // Matched words.
      for (var wordItr = 0; wordItr < numberOfWords; wordItr++) {
        const word = currentText[currentTextIdx++];
        const entity = entities[entityIdx++].data;

        const newEntity = createEntity(entity.start, entity.end, 0.0, word, -1);
        newEntities.push(newEntity);
      }
    } else if (diffType === -1) {
      // Deletion
      if (nextDiffEntry !== -1 && nextDiffEntry[0] === 1) {
        // If next entry is a insert, the operation is a replacement.
        const numberOfReplacements = (nextDiffEntry[1].match(/\n/g) || []).length;

        if (numberOfReplacements === numberOfWords) {
          // If the number of replacement words is equal to the number of original words
          // it is easily possible to match them correctly.
          for (var wordItr = 0; wordItr < numberOfWords; wordItr++) {
            const word = currentText[currentTextIdx++];
            const entity = entities[entityIdx++].data;

            const newEntity = createEntity(entity.start, entity.end, 0.0, word, -1);
            newEntities.push(newEntity);
          }
        } else {
          // Otherwise, we give the whole segment the same timestamp.
          const entityStart = entities[entityIdx].data.start;
          const entityEnd = entities[entityIdx + numberOfWords - 1].data.end;

          for (var wordItr = 0; wordItr < numberOfReplacements; wordItr++) {
            const word = currentText[currentTextIdx++];
            const newEntity = createEntity(entityStart, entityEnd, 0.0, word, -1);
            newEntities.push(newEntity);
          }
          entityIdx += numberOfWords;
        }
        diffIdx++;
      } else {
        // Deletions ignore the corresponding entity.
        entityIdx += numberOfWords;
      }
    } else if (diffType === 1) {
      // Insertions get the same timestamp as the previous entity
      for (var wordItr = 0; wordItr < numberOfWords; wordItr++) {
        const word = currentText[currentTextIdx++];
        const entity = entities[entityIdx].data;

        const newEntity = createEntity(entity.start, entity.end, 0.0, word, -1);
        newEntities.push(newEntity);
      }
    }
    diffIdx ++;
  }

  const updatedContent = createContentFromEntityList(currentContent, newEntities);

  return updatedContent;
};

// Update timestamps usign stt-align (bbc).
const updateTimestampsSSTAlign = (currentContent, originalContent) => {
  const currentText = convertContentToText(currentContent);

  const entityMap = originalContent.entityMap;

  const entities = [];

  for (var entityIdx in entityMap) {
    entities.push({
      start: parseFloat(entityMap[entityIdx].data.start),
      end: parseFloat(entityMap[entityIdx].data.end),
      word: entityMap[entityIdx].data.text.toLowerCase().replace(/[.?!]/g, ''),
    });
  }

  const result = alignJSONText( { words: entities }, currentText.join(' '));
  const newEntities = result.words.map((entry) => {
    return createEntity(entry.start, entry.end, 0.0, entry.word, -1);
  });
  const updatedContent = createContentFromEntityList(currentContent, newEntities);

  return updatedContent;
};

export { updateTimestamps, updateTimestampsSSTAlign };
