import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CustomEditor from './CustomEditor';
import { compositeDecorator, customKeyBindingFn } from './draftJsConfig';
import { getWordCount, splitParagraphs } from './draftJsHelper';
import updateEditorTimestamps from './updateEditorTimestamps';

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
              setEditorState(updateEditorTimestamps(editorState, originalState));
              saveLocally();
              clearTimeout(saveTimer);
            },
            SAVE_INTERVAL_MS));
        }
      });
    }
  };

  const handleChange = () => {
    if (isTranscriptChange) {
      // for when to update config and force rerender
      onChange();
    }
  };

  /**
  * Update Editor content state
  */
  const updateEditorState = (newContentState) => {
    const newEditorState = EditorState.push(editorState, newContentState);
    setEditorState(newEditorState);
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
  const time = Math.round(props.currentTime * 4.0) / 4.0;

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
        handleKeyCommand={ handleKeyCommand }
        customKeyBindingFn={ customKeyBindingFn }
        spellCheck={ props.spellCheck }
        showSpeakers={ props.showSpeakers }
        showTimecodes={ props.showTimecodes }
        timecodeOffset={ props.timecodeOffset }
        setEditorNewContentState={ updateEditorState }
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
      { props.transcriptData !== null ? editor : null }
    </section>
  );
};

TimedTextEditor.propTypes = {
  currentTime: PropTypes.number,
  fileName: PropTypes.string,
  handleAnalyticsEvents: PropTypes.func,
  handlePlayMedia: PropTypes.func,
  handleSave: PropTypes.func,
  handleWordClick: PropTypes.func,
  isEditable: PropTypes.bool,
  isPauseWhileTyping: PropTypes.bool,
  isPlaying: PropTypes.func,
  isScrollIntoView: PropTypes.bool,
  isScrollIntoViewOn: PropTypes.any,
  isSpellCheck: PropTypes.bool,
  mediaUrl: PropTypes.string,
  onWordClick: PropTypes.any,
  showSpeakers: PropTypes.bool,
  showTimecodes: PropTypes.bool,
  spellCheck: PropTypes.any,
  sttJsonType: PropTypes.string,
  timecodeOffset: PropTypes.number,
  transcriptData: PropTypes.object
};

export default TimedTextEditor;