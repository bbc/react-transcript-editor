import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compositeDecorator, customKeyBindingFn as keyBindingFn } from './draftJsConfig';
import { getWordCount, splitParagraphs } from './draftJsHelper';
import updateEditorTimestamps from './updateEditorTimestamps';

import WrapperBlock from './WrapperBlock';
// import Word from './Word';
import MemoEditor from './MemoEditor';
import {
  EditorState,
  convertFromRaw,
  convertToRaw,
} from 'draft-js';

// TODO: connect to local packages version
import sttJsonAdapter from '../../stt-adapters';
// TODO: connect to local packages version
// import exportAdapter from '../../export-adapters';
import style from './index.module.css';

// DraftJs decorator to recognize which entity is which
// and know what to apply to what component

const TimedTextEditor = (props) => {
  const INTERVAL_MS = 1000;
  const [ editorState, setEditorState ] = useState(EditorState.createEmpty());
  const [ originalState, setOriginalState ] = useState();
  const [ updateTimer, setUpdateTimer ] = useState(undefined);

  /**
   * Handle draftJs custom key commands
   */
  const handleKeyCommand = (command) => {
    const handleSplitParagraph = () => {
      const currentSelection = editorState.getSelection();

      if (currentSelection.isCollapsed) {
        try {
          const newEditorState = splitParagraphs(editorState, currentSelection);
          setEditorState(newEditorState);
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

  /**
  * Update Editor content state
  */

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
      if (props.isScrollIntoView) {
        const currentWordElement = document.querySelector(`span.Word[data-start="${ currentWord.start }"]`);
        currentWordElement.scrollIntoView({ block: 'nearest', inline: 'center' });
      }
    }

    return currentWord;
  };

  const updateContentState = (newContentState) => {
    const newEditorState = EditorState.push(editorState, newContentState);
    setEditorState(newEditorState);
  };

  const blockRendererFn = () => {
    return {
      component: WrapperBlock,
      editable: props.isEditable,
      props: {
        showSpeakers: props.showSpeakers,
        showTimecodes: props.showTimecodes,
        timecodeOffset: props.timecodeOffset,
        editorState: editorState,
        setEditorNewContentState: updateContentState,
        handleWordClick: props.handleWordClick,
        handleAnalyticsEvents: props.handleAnalyticsEvents
      }
    };
  };

  const updateTimeStamps = () => {
    const newEditorState = updateEditorTimestamps(editorState, originalState);
    setEditorState(newEditorState);
  };

  const onUpdateTimeout = () => {
    if (updateTimer) {
      clearTimeout(updateTimer);
    }
    setUpdateTimer(setTimeout(() => {
      updateTimeStamps();
      if (props.handleSave) {
        props.handleSave().bind(editorState);
      }

    }, INTERVAL_MS));
  };

  const onChange = (newState) => {
    // https://draftjs.org/docs/api-reference-editor-state#lastchangetype
    // https://draftjs.org/docs/api-reference-editor-change-type
    // doing editorStateChangeType === 'insert-characters'  is triggered even
    // outside of draftJS eg when clicking play button so using this instead
    // see issue https://github.com/facebook/draft-js/issues/1060

    if (props.isEditable) {
      setEditorState(newState);
      if (props.handleEdit) {
        props.handleEdit().bind(editorState);
      }
    }
    if (editorState.getCurrentContent() !== newState.getCurrentContent()) {
      onUpdateTimeout();
    }
  };

  useEffect(() => {

    const handleWordCountAnalyticEvent = () => {
      const wc = getWordCount(editorState);
      props.handleAnalyticsEvents({
        category: 'TimedTextEditor',
        action: 'setEditorContentState',
        name: 'getWordCount',
        value: wc
      });
    };

    const initEditorStates = () => {
      const blocks = sttJsonAdapter(props.transcriptData, props.sttJsonType);
      const contentState = convertFromRaw(blocks);
      setOriginalState(convertToRaw(contentState));

      const newEditorState = EditorState.createWithContent(contentState, compositeDecorator);
      setEditorState(newEditorState);
    };

    // loadData
    if (!editorState.getCurrentContent().hasText() && props.transcriptData) {
      initEditorStates();

      if (props.handleAnalyticsEvents) {
        handleWordCountAnalyticEvent();
      }
    }

    return () => {
    };
  }, [ editorState, originalState, props, updateTimer ]);

  const currentWord = getCurrentWord();
  const highlightColour = '#69e3c2';
  const unplayedColor = '#767676';
  const correctionBorder = '1px dotted blue';

  // Time to the nearest half second
  const time = Math.round(props.currentTime * 4.0) / 4.0;

  return (
    <section data-testid="section-editor"
      className={ style.editor }
      onDoubleClick={ (e) => handleDoubleClick(e) }
    // TODO: decide if on mobile want to have a way to "click" on words
    // to play corresponding media
    // a double tap would be the ideal solution
    // onTouchStart={ event => this.handleDoubleClick(event) }
    >
      <style scoped data-testid="section-style">
        {`span.Word[data-start="${ currentWord.start }"] { background-color: ${ highlightColour }; text-shadow: 0 0 0.01px black }`}
        {`span.Word[data-start="${ currentWord.start }"]+span { background-color: ${ highlightColour } }`}
        {`span.Word[data-prev-times~="${ Math.floor(time) }"] { color: ${ unplayedColor } }`}
        {`span.Word[data-prev-times~="${ time }"] { color: ${ unplayedColor } }`}
        {`span.Word[data-confidence="low"] { border-bottom: ${ correctionBorder } }`}
      </style>
      <MemoEditor data-testid="custom-editor"
        editorState={ editorState }
        onChange={ onChange }
        stripPastedStyles
        blockRendererFn={ blockRendererFn }
        handleKeyCommand={ handleKeyCommand }
        keyBindingFn={ keyBindingFn }
        spellCheck={ props.spellCheck }
      />
    </section>
  );
};
TimedTextEditor.default = {
  timecodeOffset: 0,
  currentTime: 0,
  isEditable: true,
  spellCheck: false,
  isScrollIntoView: true,
  showSpeakers: true,
  showTimecodes: true,
};

TimedTextEditor.propTypes = {
  currentTime: PropTypes.number,
  fileName: PropTypes.string,
  handleAnalyticsEvents: PropTypes.func,
  handleEdit: PropTypes.func,
  handleSave: PropTypes.func,
  handleWordClick: PropTypes.func,
  isEditable: PropTypes.bool,
  isScrollIntoView: PropTypes.bool,
  mediaUrl: PropTypes.string,
  showSpeakers: PropTypes.bool,
  showTimecodes: PropTypes.bool,
  spellCheck: PropTypes.bool,
  sttJsonType: PropTypes.string,
  timecodeOffset: PropTypes.number,
  transcriptData: PropTypes.object
};

export default TimedTextEditor;
