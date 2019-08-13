import generateEntitiesRanges from '../../../stt-adapters/generate-entities-ranges';
import { createEntityMap } from '../../../stt-adapters';
import alignWords from './stt-align-node.js';

const convertContentToText = (content) => {
  let text = [];
  for (const blockIndex in content.blocks) {
    const block = content.blocks[blockIndex];
    const blockArray = block.text.match(/\S+/g) || [];
    text = text.concat(blockArray);
  }

  return text;
};

const createEntity = (start, end, confidence, word, wordIndex) => {
  return ({
    start: start,
    end: end,
    confidence: confidence,
    word: word.toLowerCase().replace(/[.?!]/g, ''),
    punct: word,
    index: wordIndex,
  });
};

const createContentFromEntityList = (currentContent, newEntities) => {
  // Update entites to block structure.
  const updatedBlockArray = [];
  let totalWords = 0;

  for (const blockIndex in currentContent.blocks) {
    const block = currentContent.blocks[blockIndex];
    // if copy and pasting large chunk of text
    // currentContentBlock, would not have speaker and start/end time info
    // so for updatedBlock, getting start time from first word in blockEntities
    const wordsInBlock = (block.text.match(/\S+/g) || []).length;
    const blockEntites = newEntities.slice(totalWords, totalWords + wordsInBlock);
    let speaker = block.data.speaker;

    if (!speaker) {
      console.log('speaker', speaker, block);
      speaker = 'U_UKN';
    }
    const updatedBlock = {
      text: blockEntites.map((entry) => entry.punct).join(' '),
      type: 'paragraph',
      data: {
        speaker: speaker,
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

// Update timestamps usign stt-align (bbc).
const updateTimestamps = (currentContent, originalContent) => {
  const currentText = convertContentToText(currentContent);

  const entityMap = originalContent.entityMap;

  const entities = [];

  for (const entityIdx in entityMap) {
    entities.push({
      start: parseFloat(entityMap[entityIdx].data.start),
      end: parseFloat(entityMap[entityIdx].data.end),
      word: entityMap[entityIdx].data.text,
    });
  }

  const result = alignWords(entities, currentText);

  const newEntities = result.map((entry, index) => {
    return createEntity(entry.start, entry.end, 0.0, entry.word, index);
  });
  const updatedContent = createContentFromEntityList(currentContent, newEntities);

  return updatedContent;
};

export default updateTimestamps;
