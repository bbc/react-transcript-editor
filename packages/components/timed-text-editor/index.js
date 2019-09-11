import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CustomEditor from './CustomEditor';

import {
  EditorState,
  CompositeDecorator,
  convertFromRaw,
  convertToRaw,
  getDefaultKeyBinding,
  Modifier
} from 'draft-js';

import Word from './Word';

// TODO: connect to local packages version
import sttJsonAdapter from '../../stt-adapters';
// TODO: connect to local packages version
import exportAdapter from '../../export-adapters';
import updateTimestamps from './updateTimestamps/index.js';
import style from './index.module.css';

// DraftJs decorator to recognize which entity is which
// and know what to apply to what component
const getEntityStrategy = mutability => {
  const strategy = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
      const entity = character.getEntity();
      if (entity) {
        const entityMutability = contentState.getEntity(entity).getMutability();

        return (entityMutability === mutability);
      } else {
        return false;
      }
    }, callback);
  };

  return strategy;
};

const compositeDecorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy('MUTABLE'),
    component: Word,
  },
]);

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

const TimedTextEditor = (props) => {
  const [ editorState, setEditorState ] = useState(EditorState.createEmpty());
  // if using local media instead of using random blob name
  // that makes it impossible to retrieve from on page refresh
  // use file name
  const mediaName = props.mediaUrl.includes('blob') ? props.fileName : props.mediaUrl;
  const [ originalState, setOriginalState ] = useState();

  const [ isConfigChange, setIsConfigChange ] = useState(false);
  const [ isTranscriptChange, setIsTranscriptChange ] = useState(false);
  const [ isInLocalStorage, setIsInLocalStorage ] = useState(false);
  const [ saveTimer, setSaveTimer ] = useState(undefined);
  const [ pauseTimer, setPauseTimer ] = useState(undefined);

  const TYPE_PAUSE_INTERVAL_MS = 3000;
  const SAVE_INTERVAL_MS = 1000;

  const setPauseWhileTyping = (ms) => {
    props.handlePlayMedia(false);
    // Pause video for X seconds
    // resets timeout
    clearTimeout(pauseTimer);
    setPauseTimer(
      setTimeout(() => props.handlePlayMedia(true), ms));
  };

  const handleChange = () => {
    if (isTranscriptChange) {
      // for when to update config and force rerender
      onChange();
    }
  };

  const getUpdatedSelection = (selectionState, currentBlocks, updatedBlocks) => {
    // Build block map, which maps the block keys of the previous content to the block keys of the
    // updated content.
    const blockMap = {};
    for (let i = 0; i < currentBlocks.length; i++) {
      blockMap[currentBlocks[i].key] = updatedBlocks[i].key;
    }

    const selection = selectionState.merge({
      anchorOffset: selectionState.getAnchorOffset(),
      anchorKey: blockMap[selectionState.getAnchorKey()],
      focusOffset: selectionState.getFocusOffset(),
      focusKey: blockMap[selectionState.getFocusKey()],
    });

    return selection;
  };

  const updateEditorStateTimestamps = () => {
    // Update timestamps according to the original state.
    const currentContentRaw = convertToRaw(editorState.getCurrentContent());
    const updatedContentRaw = updateTimestamps(currentContentRaw, originalState);
    const updatedContent = convertFromRaw(updatedContentRaw);

    const newEditorState = EditorState.push(editorState, updatedContent);
    const selectionState = editorState.getSelection();

    // Check if editor has currently the focus. If yes, keep current selection.
    if (selectionState.getHasFocus()) {
      const selection = getUpdatedSelection(selectionState, currentContentRaw.blocks, updatedContentRaw.blocks);
      const newEditorStateSelected = EditorState.forceSelection(newEditorState, selection);
      setEditorState(newEditorStateSelected);
    } else {
      setEditorState(newEditorState);
    }
  };

  const saveLocally = () => {
    const currentContentRaw = convertToRaw(editorState.getCurrentContent());
    localStorage.setItem(`draftJs-${ mediaName }`, JSON.stringify(currentContentRaw));
    isInLocalStorage(true);
  };

  const onChange = (es) => {
    // https://draftjs.org/docs/api-reference-editor-state#lastchangetype
    // https://draftjs.org/docs/api-reference-editor-change-type
    // doing editorStateChangeType === 'insert-characters'  is triggered even
    // outside of draftJS eg when clicking play button so using this instead
    // see issue https://github.com/facebook/draft-js/issues/1060
    if (props.isPauseWhileTyping && props.isPlaying()) {
      setPauseWhileTyping(TYPE_PAUSE_INTERVAL_MS);
    }
    if (props.isEditable) {
      // saving when user has stopped typing for more then five seconds
      setEditorState(es).then(() => {
        if (saveTimer) {
          clearTimeout(saveTimer);
        } else {
          setSaveTimer(
            setTimeout(() => {
              updateEditorStateTimestamps();
              saveLocally();
              clearTimeout(saveTimer);
            },
            SAVE_INTERVAL_MS));
        }
      });
    }
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
  const splitParagraphCollapsed = (selection) => {
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

    const newEditorState = EditorState.push(editorState, newSplitContentState);
    setEditorState(newEditorState);
  };

  /**
   * Listen for draftJs custom key bindings
   */
  const customKeyBindingFn = (e) => {

    const enterKey = 13;
    const spaceKey = 32;
    const kKey = 75;
    const lKey = 76;
    const jKey = 74;
    const equalKey = 187;//used for +
    const minusKey = 189; // -
    const rKey = 82;
    const tKey = 84;

    if (e.keyCode === enterKey ) {
      return 'split-paragraph';
    }
    // if alt key is pressed in combination with these other keys
    if (e.altKey && ((e.keyCode === spaceKey)
    || (e.keyCode === spaceKey)
    || (e.keyCode === kKey)
    || (e.keyCode === lKey)
    || (e.keyCode === jKey)
    || (e.keyCode === equalKey)
    || (e.keyCode === minusKey)
    || (e.keyCode === rKey)
    || (e.keyCode === tKey))
    ) {
      e.preventDefault();

      return 'keyboard-shortcuts';
    }

    return getDefaultKeyBinding(e);
  };

  /**
   * Handle draftJs custom key commands
   */
  const handleKeyCommand = (command) => {
    const handleSplitParagraph = () => {
      const currentSelection = editorState.getSelection();

      if (currentSelection.isCollapsed) {
        try {
          splitParagraphCollapsed(currentSelection);
        } catch (e) {
          console.log(e);

          return 'not-handled';
        }

        return 'handled';
      }

      return 'not-handled';
    };

    switch (command) {
    case 'split-paragraph':
      return handleSplitParagraph();
    case 'keyboard-shortcuts':
      return 'handled';
    default:
      return 'not-handled';
    }
  };

  const handleConfigChange = () => {
    setIsConfigChange(true);
    // handle rerender
  };

  // const getEditorContent = (exportFormat, title) => {
  //   const format = exportFormat || 'draftjs';
  //   updateEditorStateTimestamps();

  //   return exportAdapter(convertToRaw(editorState.getCurrentContent()), format, title);
  // };

  // click on words - for navigation
  // eslint-disable-next-line class-methods-use-this
  const handleDoubleClick = (event) => {
    // nativeEvent --> React giving you the DOM event
    let element = event.nativeEvent.target;
    // find the parent in Word that contains span with time-code start attribute
    while (!element.hasAttribute('data-start') && element.parentElement) {
      element = element.parentElement;
    }

    if (element.hasAttribute('data-start')) {
      const t = parseFloat(element.getAttribute('data-start'));
      props.handleWordClick(t);
    }
  };

  const onSave = () => {
    props.handleSave();
  };

  const getCurrentWord = () => {
    const currentWord = {
      start: 'NA',
      end: 'NA'
    };

    if (editorState) {
      const contentState = editorState.getCurrentContent();
      // TODO: using convertToRaw here might be slowing down performance(?)
      const entityMap = convertToRaw(contentState).entityMap;

      for (var entityKey in entityMap) {
        const entity = entityMap[entityKey];
        const word = entity.data;

        if (word.start <= props.currentTime && word.end >= props.currentTime) {
          currentWord.start = word.start;
          currentWord.end = word.end;
        }
      }
    }

    if (currentWord.start !== 'NA') {
      if (props.isScrollIntoViewOn) {
        const currentWordElement = document.querySelector(`span.Word[data-start="${ currentWord.start }"]`);
        currentWordElement.scrollIntoView({ block: 'nearest', inline: 'center' });
      }
    }

    return currentWord;
  };

  const onWordClick = (e) => {
    props.onWordClick(e);
  };

  const currentWord = getCurrentWord();
  const highlightColour = '#69e3c2';
  const unplayedColor = '#767676';
  const correctionBorder = '1px dotted blue';

  // Time to the nearest half second
  const time = Math.round(this.props.currentTime * 4.0) / 4.0;

  const editor = (
    <section
      className={ style.editor }
      onDoubleClick={ handleDoubleClick }
      // TODO: decide if on mobile want to have a way to "click" on words
      // to play corresponding media
      // a double tap would be the ideal solution
      // onTouchStart={ event => this.handleDoubleClick(event) }
    >
      <style scoped>
        {`span.Word[data-start="${ currentWord.start }"] { background-color: ${ highlightColour }; text-shadow: 0 0 0.01px black }`}
        {`span.Word[data-start="${ currentWord.start }"]+span { background-color: ${ highlightColour } }`}
        {`span.Word[data-prev-times~="${ Math.floor(time) }"] { color: ${ unplayedColor } }`}
        {`span.Word[data-prev-times~="${ time }"] { color: ${ unplayedColor } }`}
        {`span.Word[data-confidence="low"] { border-bottom: ${ correctionBorder } }`}
      </style>
      <CustomEditor
        editorState={ editorState }
        onChange={ handleChange }
        stripPastedStyles
        // renderBlockWithTimecodes={ this.renderBlockWithTimecodes }
        handleKeyCommand={ handleKeyCommand }
        customKeyBindingFn={ customKeyBindingFn }
        spellCheck={ props.spellCheck }
        showSpeakers={ props.showSpeakers }
        showTimecodes={ props.showTimecodes }
        timecodeOffset={ props.timecodeOffset }
        setEditorNewContentState={ setEditorNewContentState }
        onWordClick={ onWordClick }
        handleAnalyticsEvents={ props.handleAnalyticsEvents }
      />
    </section>
  );

  useEffect(() => {

    if (props.mediaUrl) {
      const localSave = localStorage.getItem(`draftJs-${ mediaName }`);
      if (localSave) {
        setIsInLocalStorage(true);
      } else {
        setIsInLocalStorage(false);
      }
    }

    const handleWordCountAnalyticEvent = () => {
      const wc = getWordCount(editorState);
      props.handleAnalyticsEvents({
        category: 'TimedTextEditor',
        action: 'setEditorContentState',
        name: 'getWordCount',
        value: wc
      });
    };

    const getEditorStateWithTranscript = () => {
      const blocks = sttJsonAdapter(props.transcriptData, props.sttJsonType);
      setOriginalState(convertToRaw(convertFromRaw(blocks)));
      const contentState = convertFromRaw(blocks);

      return EditorState.createWithContent(contentState, compositeDecorator);
    };

    // loadData
    if (props.transcriptData) {
      setEditorState(getEditorStateWithTranscript());

      if (props.handleAnalyticsEvents) {
        handleWordCountAnalyticEvent();
      }
    }

    const forceRenderDecorator = () => {
      // forcing a re-render is an expensive operation and
      // there might be a way of optimising this at a later refactor (?)
      // the issue is that WrapperBlock is not update on TimedTextEditor
      // state change otherwise.
      // for now compromising on this, as setting timecode offset, and
      // display preferences for speakers and timecodes are not expected to
      // be very frequent operations but rather one time setup in most cases.
      const contentState = editorState.getCurrentContent();

      const newState = EditorState.createWithContent(
        contentState,
        editorState.getDecorator()
      );

      const newEditorState = EditorState.push(newState, contentState);

      // is there a difference between newEditorState + newState??? ever???
      setEditorState(newEditorState);
    };

    if (!isInLocalStorage) {
      setEditorState(getEditorStateWithTranscript());
      setIsInLocalStorage(true);
    }

    if (isConfigChange) {
      forceRenderDecorator();
      setIsConfigChange(false);
    }

  }, [ editorState, isConfigChange, isInLocalStorage, mediaName, props, props.sttJsonType, props.transcriptData ]);

  return (
    <section>
      { this.props.transcriptData !== null ? editor : null }
    </section>
  );
};

TimedTextEditor.propTypes = {
  transcriptData: PropTypes.object,
  mediaUrl: PropTypes.string,
  isEditable: PropTypes.bool,
  isSpellCheck: PropTypes.bool,
  isScrollIntoView: PropTypes.bool,
  isPauseWhileTyping: PropTypes.bool,
  handleWordClick: PropTypes.func,
  handleSave: PropTypes.func,
  sttJsonType: PropTypes.string,
  isPlaying: PropTypes.func,
  handlePlayMedia: PropTypes.func,
  currentTime: PropTypes.number,
  timecodeOffset: PropTypes.number,
  handleAnalyticsEvents: PropTypes.func,
  showSpeakers: PropTypes.bool,
  showTimecodes: PropTypes.bool,
  fileName: PropTypes.string
};

export default TimedTextEditor;
