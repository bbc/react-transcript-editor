import {
  EditorState,
  Modifier,
  convertToRaw,
  convertFromRaw
} from 'draft-js';

import updateTimestamps from '../UpdateTimestamps/index.js';

// originally from
// https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-counter-plugin/src/WordCounter/index.js#L12
const getWordCount = (editorState) => {
  const plainText = editorState.getCurrentContent().getPlainText('');
  const regex = /(?:\r\n|\r|\n)/g; // new line, carriage return, line feed
  const cleanString = plainText.replace(regex, ' ').trim(); // replace above characters w/ space
  const wordArray = cleanString.match(/\S+/g); // matches words according to whitespace

  return wordArray ? wordArray.length : 0;
};

/**
 * Helper function for splitParagraph
 * to find the closest entity (word) to a selection point
 * that does not fall on an entity to begin with
 * Looks before if it's last char in a paragraph block.
 * After for everything else.
 */
const findClosestEntityKeyToSelectionPoint = (currentSelection, originalBlock) => {
  let entityKey = null;
  let isEndOfParagraph = false;

  // selection offset from beginning of the paragraph block
  const startSelectionOffsetKey = currentSelection.getStartOffset();
  // length of the plain text for the ContentBlock
  const lengthPlainTextForTheBlock = originalBlock.getLength();
  // number of char from selection point to end of paragraph
  const remainingCharNumber =
    lengthPlainTextForTheBlock - startSelectionOffsetKey;
  // if it's the last char in the paragraph - get previous entity
  if (remainingCharNumber === 0) {
    isEndOfParagraph = true;

    for (let j = lengthPlainTextForTheBlock; j > 0; j--) {
      entityKey = originalBlock.getEntityAt(j);
      if (entityKey !== null) {
        // if it finds it then return
        return { entityKey, isEndOfParagraph };
      }
    }
  }
  // if it's first char or another within the block - get next entity
  else {
    let initialSelectionOffset = currentSelection.getStartOffset();
    for (let i = 0; i < remainingCharNumber; i++) {
      initialSelectionOffset += i;
      entityKey = originalBlock.getEntityAt(initialSelectionOffset);

      if (entityKey !== null) {
        return { entityKey, isEndOfParagraph };
      }
    }
  }

  return { entityKey, isEndOfParagraph };
};

/**
 * Helper function to handle splitting paragraphs with return key
 * on enter key, perform split paragraph at selection point.
 * Add timecode of next word after split to paragraph
 * as well as speaker name to new paragraph
 * TODO: move into its own file as helper function
 */
const splitParagraph = (editorState) => {
  // https://github.com/facebook/draft-js/issues/723#issuecomment-367918580
  // https://draftjs.org/docs/api-reference-selection-state#start-end-vs-anchor-focus

  const currentSelection = editorState.getSelection();

  // only perform if selection is not selecting a range of words
  // in that case, we'd expect delete + enter to achieve same result.
  if (currentSelection.isCollapsed()) {
    const currentContent = editorState.getCurrentContent();

    // https://draftjs.org/docs/api-reference-modifier#splitblock
    const newContentState = Modifier.splitBlock(currentContent, currentSelection);

    // https://draftjs.org/docs/api-reference-editor-state#push
    const splitState = EditorState.push(editorState, newContentState, 'split-block');

    const targetSelection = splitState.getSelection();
    const originalBlock = currentContent.blockMap.get(newContentState.selectionBefore.getStartKey());
    const originalBlockData = originalBlock.getData();
    const blockSpeaker = originalBlockData.get('speaker');

    let wordStartTime = 'NA';
    let isEndOfParagraph = false;

    // identify the entity (word) at the selection/cursor point on split.
    let entityKey = originalBlock.getEntityAt(currentSelection.getStartOffset());

    // if there is no word entity associated with a char then there is no entity key
    // at that selection point
    if (entityKey === null) {
      const closestEntityToSelection = findClosestEntityKeyToSelectionPoint(
        currentSelection,
        originalBlock
      );

      entityKey = closestEntityToSelection.entityKey;
      isEndOfParagraph = closestEntityToSelection.isEndOfParagraph;
      // handle edge case when it doesn't find a closest entity (word)
      // eg pres enter on an empty line
      if (entityKey === null) {
        return 'not-handled';
      }
    }
    // if there is an entityKey at or close to the selection point
    // can get the word startTime. for the new paragraph.
    const entityInstance = currentContent.getEntity(entityKey);
    const entityData = entityInstance.getData();

    if (isEndOfParagraph) {
      wordStartTime = entityData.end;
    } else {
      wordStartTime = entityData.start;
    }

    // split paragraph
    // https://draftjs.org/docs/api-reference-modifier#mergeblockdata
    const afterMergeContentState = Modifier.mergeBlockData(
      splitState.getCurrentContent(),
      targetSelection,
      {
        start: wordStartTime,
        speaker: blockSpeaker
      }
    );

    return afterMergeContentState;
  }

  return 'not-handled';
};

const getCurrentWord = (editorState, currentTime) => {
  const currentWord = {
    start: 'NA',
    end: 'NA'
  };

  const contentState = editorState.getCurrentContent();
  // TODO: using convertToRaw here might be slowing down performance(?)
  const contentStateConvertEdToRaw = convertToRaw(contentState);
  const entityMap = contentStateConvertEdToRaw.entityMap;

  for (const entityKey in entityMap) {
    const entity = entityMap[entityKey];
    const word = entity.data;

    if (word.start <= currentTime && word.end >= currentTime) {
      currentWord.start = word.start;
      currentWord.end = word.end;
    }
  }

  return currentWord;
};

const updateTimestampsForEditorState = (editorState, originalState) => {
  // Update timestamps according to the original state.
  const currentContent = convertToRaw(editorState.getCurrentContent());
  const updatedContentRaw = updateTimestamps(currentContent, originalState);
  const updatedContent = convertFromRaw(updatedContentRaw);

  // Update editor state
  const newEditorState = EditorState.push(editorState, updatedContent);

  // Re-convert updated content to raw to gain access to block keys
  const updatedContentBlocks = convertToRaw(updatedContent);

  // Get current selection state and update block keys
  const selectionState = editorState.getSelection();

  // Check if editor has currently the focus. If yes, keep current selection.
  if (selectionState.getHasFocus()) {
    // Build block map, which maps the block keys of the previous content to the block keys of the
    // updated content.
    const blockMap = {};

    for (let blockIdx = 0; blockIdx < currentContent.blocks.length; blockIdx++) {
      blockMap[currentContent.blocks[blockIdx].key] =
        updatedContentBlocks.blocks[blockIdx].key;
    }

    const selection = selectionState.merge({
      anchorOffset: selectionState.getAnchorOffset(),
      anchorKey: blockMap[selectionState.getAnchorKey()],
      focusOffset: selectionState.getFocusOffset(),
      focusKey: blockMap[selectionState.getFocusKey()]
    });

    // Set the updated selection state on the new editor state
    const newEditorStateSelected = EditorState.forceSelection(newEditorState, selection);

    return newEditorStateSelected;
  } else {

    return newEditorState;
  }
};

export {
  getWordCount,
  findClosestEntityKeyToSelectionPoint,
  splitParagraph,
  getCurrentWord,
  updateTimestampsForEditorState
};
