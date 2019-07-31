import generateEntitiesRanges from '../../../stt-adapters/generate-entities-ranges/index.js';
import { createEntityMap } from '../../../stt-adapters/index.js';
import alignWords from './stt-align-node.js';

const convertContentToText = (content) => {
  let text = [];
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
    // if copy and pasting large chunk of text
    // currentContentBlock, would not have speaker and start/end time info
    // so for updatedBlock, getting start time from first word in blockEntities
    const wordsInBlock = (block.text.match(/\S+/g) || []).length;
    const blockEntites = newEntities.slice(totalWords, totalWords + wordsInBlock);
    let speaker = block.data.speaker;

    if (!speaker) {
      console.log('speaker', speaker, block);
      speaker = 'U_UKN';
      // console.log(' originalContent[blockIdx] ', originalContent[blockIdx] );
    }
    
    const updatedBlock = {
      text: blockEntites.map((entry) => entry.punct).join(' '),
      type: 'paragraph',
      data: {
        speaker: block.data.speaker,
        words: blockEntites,
        start: block.data.start
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

  for (var entityIdx in entityMap) {
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
