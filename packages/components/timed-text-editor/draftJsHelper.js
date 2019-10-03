import {
  EditorState,
  Modifier
} from 'draft-js';

const getPrevEntity = (block) => {
  for (let j = block.getLength(); j > 0 ; j--) {
    const entity = block.getEntityAt(j);
    if (entity) {
      return entity;
    }
  }
};

const getNextEntity = (offset, block) => {
  const startingIndex = offset + 1;
  for (let i = startingIndex; i < block.getLength() - offset ; i++) {
    const entity = block.getEntityAt(i);
    if (entity) {
      return entity;
    }
  }
};

const isEndOfBlock = (offset, block) => {
  const blockLength = block.getLength();
  const remainder = blockLength - offset;

  return (remainder === 0) ? true : false;

};

const findNearestEntity = (offset, block) => {
  const nearestEntity = isEndOfBlock(offset, block) ? getPrevEntity(block) : getNextEntity(offset, block);

  return nearestEntity;
};

const getWordCount = (editorState) => {
  const plainText = editorState.getCurrentContent().getPlainText('');
  const regex = /(?:\r\n|\r|\n)/g; // new line, carriage return, line feed
  const cleanString = plainText.replace(regex, ' ').trim(); // replace above characters w/ space
  const wordArray = cleanString.match(/\S+/g); // matches words according to whitespace

  return wordArray ? wordArray.length : 0;
};

const getEntity = (block, offset) => {
  let entity = block.getEntityAt(offset); // get word where the paragraph breaks

  if (!entity) {
    entity = findNearestEntity(offset, block);
    if (!entity) {
      throw Error('no close entity');
    }
  }

  return entity;
};

const getSplitBlockWordStartTime = (content, block, offset) => {
  const entity = getEntity(block, offset);
  const word = content.getEntity(entity).getData();
  if (word) {
    return isEndOfBlock(offset, block) ? word.end : word.start;
  } else {
    return 'NA';
  }
};

const updateBlockOnSplit = (content, startKey, offset) => {
  const block = content.getBlockForKey(startKey);
  const wordStartTime = getSplitBlockWordStartTime(content, block, offset);
  const speaker = block.getData().get('speaker');

  return {
    'start': wordStartTime,
    'speaker': speaker
  };
};

/**
   * Helper function to handle splitting paragraphs with return key
   * on enter key, perform split paragraph at selection point.
   * Add timecode of next word after split to paragraph
   * as well as speaker name to new paragraph
   * TODO: move into its own file as helper function
   */
// https://github.com/facebook/draft-js/issues/723#issuecomment-367918580
// https://draftjs.org/docs/
const splitParagraphs = (editorState, selection) => {
  const content = editorState.getCurrentContent();
  const splitContent = Modifier.splitBlock(content, selection);
  const splitState = EditorState.push(editorState, splitContent, 'split-block');

  const offset = selection.getStartOffset();
  const previousBlockStartKey = splitContent.selectionBefore.getStartKey();

  const newSplitContentState = Modifier.mergeBlockData(
    splitState.getCurrentContent(),
    splitState.getSelection(),
    updateBlockOnSplit(content, previousBlockStartKey, offset)
  );

  return EditorState.push(editorState, newSplitContentState);
};

export { getWordCount, splitParagraphs };