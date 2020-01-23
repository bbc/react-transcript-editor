import React from 'react';
import PropTypes from 'prop-types';

import {
  Editor,
  EditorState,
  CompositeDecorator,
  convertFromRaw,
  convertToRaw,
  getDefaultKeyBinding,
} from 'draft-js';

import Word from './Word';
import WrapperBlock from './WrapperBlock';

import {
  getWordCount,
  splitParagraph,
  updateTimestampsForEditorState
} from './util';

import sttJsonAdapter from '../../stt-adapters';
import exportAdapter from '../../export-adapters';
import updateTimestamps from './UpdateTimestamps/index.js';

import style from './index.module.css';

class TimedTextEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty()
    };

    this.timer = null;
  }

  componentDidMount() {
    this.loadData();
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps !== this.props) return true;
    if (nextState !== this.state) return true;

    return false;
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.timecodeOffset !== this.props.timecodeOffset ||
      prevProps.showSpeakers !== this.props.showSpeakers ||
      prevProps.showTimecodes !== this.props.showTimecodes ||
      prevProps.isEditable !== this.props.isEditable
    ) {
      // forcing a re-render is an expensive operation and
      // there might be a way of optimising this at a later refactor (?)
      // the issue is that WrapperBlock is not update on TimedTextEditor
      // state change otherwise.
      // for now compromising on this, as setting timecode offset, and
      // display preferences for speakers and timecodes are not expected to
      // be very frequent operations but rather one time setup in most cases.
      this.forceRenderDecorator();
    }

    clearTimeout(this.timer);
  }

  onChange = editorState => {
    // https://draftjs.org/docs/api-reference-editor-state#lastchangetype
    // https://draftjs.org/docs/api-reference-editor-change-type
    // doing editorStateChangeType === 'insert-characters'  is triggered even
    // outside of draftJS eg when clicking play button so using this instead
    // see issue https://github.com/facebook/draft-js/issues/1060
    // also "insert-characters" does not get triggered if you delete text
    if (this.state.editorState.getCurrentContent() !== editorState.getCurrentContent()) {
      if (this.props.isPauseWhileTypingOn) {
        if (this.props.isPlaying()) {
          this.props.playMedia(false);
          // Pause video for X seconds
          const pauseWhileTypingIntervalInMilliseconds = 3000;
          // resets timeout
          clearTimeout(this.plauseWhileTypingTimeOut);
          this.plauseWhileTypingTimeOut = setTimeout(
            function() {
              // after timeout starts playing again
              this.props.playMedia(true);
            }.bind(this),
            pauseWhileTypingIntervalInMilliseconds
          );
        }
      }
    }

    if (this.props.isEditable) {
      this.setState({ editorState }, () => {
        this.timer = setTimeout(this.saveData, 3000);
      });
    }
  };

  loadData = () => {
    if (this.props.transcriptData !== null) {
      const blocks = sttJsonAdapter(this.props.transcriptData, this.props.sttJsonType);

      this.setState({
        originalState: convertToRaw(convertFromRaw(blocks))
      }, () => {
        this.setEditorContentState(blocks);
      });
    }
  }

  saveData = () => {
    const data = this.getEditorContent(this.props.autoSaveContentType, this.props.title);
    console.log('saving');

    // const currentContent = this.state.editorState.getCurrentContent();
    // const rawData = convertToRaw(currentContent);
    // const data = {
    //   ext: 'json',
    //   data: rawData,
    // };

    console.log(data);

    this.props.handleAutoSaveChanges(data);
    console.log('saved');
  }

  getEditorContent = (exportFormat, title) => {
    const format = exportFormat || 'draftjs';
    const tmpEditorState = updateTimestampsForEditorState(this.state.editorState, this.state.originalState);

    return exportAdapter(
      convertToRaw(tmpEditorState.getCurrentContent()),
      format,
      title
    );
  }

  // click on words - for navigation
  handleDoubleClick = event => {
    // nativeEvent --> React giving you the DOM event
    let element = event.nativeEvent.target;
    // find the parent in Word that contains span with time-code start attribute
    while (!element.hasAttribute('data-start') && element.parentElement) {
      element = element.parentElement;
    }

    if (element.hasAttribute('data-start')) {
      const t = parseFloat(element.getAttribute('data-start'));
      this.props.onWordClick(t);
    }
  };

  /**
   * @param {object} data.entityMap - draftJs entity maps - used by convertFromRaw
   * @param {object} data.blocks - draftJs blocks - used by convertFromRaw
   * set DraftJS Editor content state from blocks
   * contains blocks and entityMap
   */
  setEditorContentState = data => {
    const contentState = convertFromRaw(data);
    // eslint-disable-next-line no-use-before-define
    const editorState = EditorState.createWithContent(contentState, decorator);

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: 'TimedTextEditor',
        action: 'setEditorContentState',
        name: 'getWordCount',
        value: getWordCount(editorState)
      });
    }

    this.setState({ editorState }, () => {
      this.forceRenderDecorator();
    });
  };

  // Helper function to re-render this component
  // used to re-render WrapperBlock on timecode offset change
  // or when show / hide preferences for speaker labels and timecodes change
  forceRenderDecorator = () => {
    const contentState = this.state.editorState.getCurrentContent();
    const decorator = this.state.editorState.getDecorator();
    const newState = EditorState.createWithContent(contentState, decorator);
    const newEditorState = EditorState.push(newState, contentState);
    this.setState({ editorState: newEditorState });
  };

  /**
   * Update Editor content state
   */
  setEditorNewContentState = newContentState => {
    const decorator = this.state.editorState.getDecorator();
    const newState = EditorState.createWithContent(newContentState, decorator);
    const newEditorState = EditorState.push(
      newState,
      newContentState
    );
    this.setState({ editorState: newEditorState });
  };

  setEditorNewContentStateSpeakersUpdate = newContentState => {
    const decorator = this.state.editorState.getDecorator();
    const newState = EditorState.createWithContent(newContentState, decorator);
    const editorState = EditorState.push(
      newState,
      newContentState
    );

    this.setState(
      () => ({
        editorState
      }),
      () => {
        const format = this.props.autoSaveContentType;
        const title = this.props.title;

        const data = exportAdapter(
          convertToRaw(editorState.getCurrentContent()),
          format,
          title
        );

        this.props.handleAutoSaveChanges(data);
      }
    );
  };

  /**
   * Listen for draftJs custom key bindings
   */
  customKeyBindingFn = e => {
    const enterKey = 13;
    const spaceKey = 32;
    const kKey = 75;
    const lKey = 76;
    const jKey = 74;
    const equalKey = 187; //used for +
    const minusKey = 189; // -
    const rKey = 82;
    const tKey = 84;

    if (e.keyCode === enterKey) {
      console.log('customKeyBindingFn');

      return 'split-paragraph';
    }
    // if alt key is pressed in combination with these other keys
    if (
      e.altKey &&
      (e.keyCode === spaceKey ||
        e.keyCode === spaceKey ||
        e.keyCode === kKey ||
        e.keyCode === lKey ||
        e.keyCode === jKey ||
        e.keyCode === equalKey ||
        e.keyCode === minusKey ||
        e.keyCode === rKey ||
        e.keyCode === tKey)
    ) {
      e.preventDefault();

      return 'keyboard-shortcuts';
    }

    return getDefaultKeyBinding(e);
  };

  /**
   * Handle draftJs custom key commands
   */
  handleKeyCommand = command => {
    if (command === 'split-paragraph') {
      const splitBlockState = splitParagraph(this.state.editorState);

      if (splitBlockState !== 'not-handled') {
        this.setEditorNewContentState(splitBlockState);
      }
    }

    if (command === 'keyboard-shortcuts') {
      return 'handled';
    }

    return 'not-handled';
  };

  getCurrentWord = () => {
    const currentWord = {
      start: 'NA',
      end: 'NA'
    };

    if (this.props.transcriptData) {
      const contentState = this.state.editorState.getCurrentContent();
      // TODO: using convertToRaw here might be slowing down performance(?)
      const contentStateConvertEdToRaw = convertToRaw(contentState);
      const entityMap = contentStateConvertEdToRaw.entityMap;

      for (var entityKey in entityMap) {
        const entity = entityMap[entityKey];
        const word = entity.data;

        if (
          word.start <= this.props.currentTime &&
          word.end >= this.props.currentTime
        ) {
          currentWord.start = word.start;
          currentWord.end = word.end;
        }
      }
    }

    if (currentWord.start !== 'NA') {
      if (this.props.isScrollIntoViewOn) {
        const currentWordElement = document.querySelector(
          `span.Word[data-start="${ currentWord.start }"]`
        );
        currentWordElement.scrollIntoView({
          block: 'nearest',
          inline: 'center'
        });
      }
    }

    return currentWord;
  };

  onWordClick = e => {
    this.props.onWordClick(e);
  };

  renderBlockWithTimecodes = () => ({
    component: WrapperBlock,
    editable: true,
    props: {
      ...this.props,
      editorState: this.state.editorState,
    }
  });

  render() {
    const currentWord = this.getCurrentWord();
    const highlightColour = '#69e3c2';
    const unplayedColor = '#767676';
    const correctionBorder = '1px dotted blue';

    // Time to the nearest half second
    const time = Math.round(this.props.currentTime * 4.0) / 4.0;

    const editor = (
      <section
        className={ style.editor }
        onDoubleClick={ this.handleDoubleClick }
        // TODO: decide if on mobile want to have a way to "click" on words
        // to play corresponding media
        // a double tap would be the ideal solution
        // onTouchStart={ event => this.handleDoubleClick(event) }
      >
        <style scoped>
          {`span.Word[data-start="${ currentWord.start }"] { background-color: ${ highlightColour }; text-shadow: 0 0 0.01px black }`}
          {`span.Word[data-start="${ currentWord.start }"]+span { background-color: ${ highlightColour } }`}
          {`span.Word[data-prev-times~="${ Math.floor(
            time
          ) }"] { color: ${ unplayedColor } }`}
          {`span.Word[data-prev-times~="${ time }"] { color: ${ unplayedColor } }`}
          {`span.Word[data-confidence="low"] { border-bottom: ${ correctionBorder } }`}
        </style>

        <Editor
          editorState={ this.state.editorState }
          onChange={ this.onChange }
          stripPastedStyles
          blockRendererFn={ this.renderBlockWithTimecodes }
          handleKeyCommand={ this.handleKeyCommand }
          keyBindingFn={ this.customKeyBindingFn }
          spellCheck={ this.props.spellCheck }
        />
      </section>
    );

    return (
      <section>{this.props.transcriptData !== null ? editor : null}</section>
    );
  }
}

// DraftJs decorator to recognize which entity is which
// and know what to apply to what component
const getEntityStrategy = mutability => (
  contentBlock,
  callback,
  contentState
) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    if (entityKey === null) {
      return false;
    }

    return contentState.getEntity(entityKey).getMutability() === mutability;
  }, callback);
};

// decorator definition - Draftjs
// defines what to use to render the entity
const decorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy('MUTABLE'),
    component: Word
  }
]);

TimedTextEditor.propTypes = {
  transcriptData: PropTypes.object,
  mediaUrl: PropTypes.string,
  isEditable: PropTypes.bool,
  spellCheck: PropTypes.bool,
  onWordClick: PropTypes.func,
  sttJsonType: PropTypes.string,
  isPlaying: PropTypes.func,
  playMedia: PropTypes.func,
  currentTime: PropTypes.number,
  isScrollIntoViewOn: PropTypes.bool,
  isPauseWhileTypingOn: PropTypes.bool,
  timecodeOffset: PropTypes.number,
  handleAnalyticsEvents: PropTypes.func,
  showSpeakers: PropTypes.bool,
  showTimecodes: PropTypes.bool,
  fileName: PropTypes.string
};

export default TimedTextEditor;
