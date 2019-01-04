import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'react-simple-tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faMousePointer, faICursor, faUserEdit, faKeyboard, faSave } from '@fortawesome/free-solid-svg-icons';

import {
  Editor,
  EditorState,
  CompositeDecorator,
  convertFromRaw,
  convertToRaw,
  getDefaultKeyBinding,
  Modifier
} from 'draft-js';

import Word from './Word';
import WrapperBlock from './WrapperBlock';

import sttJsonAdapter from '../../Util/adapters/index.js';
import exportAdapter from '../../Util/export-adapters/index.js';
import style from './index.module.css';

class TimedTextEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      transcriptData: this.props.transcriptData,
      isEditable: this.props.isEditable,
      sttJsonType: this.props.sttJsonType,
      timecodeOffset: this.props.timecodeOffset,
      showSpeakers: this.props.showSpeakers,
      showTimecodes: this.props.showTimecodes,
      inputCount: 0,
      currentWord: {}
    };
  }

  componentDidMount() {
    this.loadData();
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.transcriptData !== null) {

      return {
        transcriptData: nextProps.transcriptData,
        isEditable: nextProps.isEditable,
        timecodeOffset: nextProps.timecodeOffset,
        showSpeakers: nextProps.showSpeakers,
        showTimecodes: nextProps.showTimecodes
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.transcriptData !== this.state.transcriptData) {
      this.loadData();
    }
    if (prevState.timecodeOffset !== this.state.timecodeOffset
      || prevState.showSpeakers !== this.state.showSpeakers
      || prevState.showTimecodes !== this.state.showTimecodes) {
      // forcing a re-render is an expensive operation and
      // there might be a way of optimising this at a later refactor (?)
      // the issue is that WrapperBlock is not update on TimedTextEditor
      // state change otherwise.
      // for now compromising on this, as setting timecode offset, and
      // display preferences for speakers and timecodes are not expected to
      // be very frequent operations but rather one time setup in most cases.
      this.forceRenderDecorator();
    }
  }

  onChange = (editorState) => {
    // https://draftjs.org/docs/api-reference-editor-state#lastchangetype
    // https://draftjs.org/docs/api-reference-editor-change-type
    // doing editorStateChangeType === 'insert-characters'  is triggered even
    // outside of draftJS eg when clicking play button so using this instead
    // see issue https://github.com/facebook/draft-js/issues/1060
    if (this.state.editorState.getCurrentContent() !== editorState.getCurrentContent()) {
      if (this.props.isPauseWhileTypingOn) {
        if (this.props.isPlaying()) {
          this.props.playMedia(false);
          // Pause video for X seconds
          const pauseWhileTypingIntervalInMilliseconds = 3000;
          // resets timeout
          clearTimeout(this.plauseWhileTypingTimeOut);
          this.plauseWhileTypingTimeOut = setTimeout(function() {
            // after timeout starts playing again
            this.props.playMedia(true);
          }.bind(this), pauseWhileTypingIntervalInMilliseconds);
        }
      }
    }

    if (this.state.isEditable) {
      this.setState((prevState) => ({
        editorState,
        inputCount: prevState.inputCount + 1,
      }), () => {
        // Saving every 5 keystrokes
        if (this.state.inputCount > 5) {
          this.setState({
            inputCount: 0,
          });

          this.localSave(this.props.mediaUrl);
        }
      });
    }
  }

  loadData() {
    if (this.props.transcriptData !== null) {
      const blocks = sttJsonAdapter(this.props.transcriptData, this.props.sttJsonType);
      this.setEditorContentState(blocks);
    }
  }

  getEditorContent(exportFormat) {
    const format = exportFormat || 'draftjs';

    return exportAdapter(convertToRaw(this.state.editorState.getCurrentContent()), format);
  }

  // click on words - for navigation
  // eslint-disable-next-line class-methods-use-this
  handleDoubleClick = (event) => {
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
  }

  localSave = () => {
    const mediaUrl = this.props.mediaUrl;
    const data = convertToRaw(this.state.editorState.getCurrentContent());
    localStorage.setItem(`draftJs-${ mediaUrl }`, JSON.stringify(data));
    const newLastLocalSavedDate = new Date().toString();
    localStorage.setItem(`timestamp-${ mediaUrl }`, newLastLocalSavedDate);

    return newLastLocalSavedDate;
  }

  // eslint-disable-next-line class-methods-use-this
  isPresentInLocalStorage(mediaUrl) {
    const data = localStorage.getItem(`draftJs-${ mediaUrl }`);
    if (data !== null) {
      return true;
    }

    return false;
  }

  loadLocalSavedData(mediaUrl) {
    const data = JSON.parse(localStorage.getItem(`draftJs-${ mediaUrl }`));
    if (data !== null) {
      const lastLocalSavedDate = localStorage.getItem(`timestamp-${ mediaUrl }`);
      this.setEditorContentState(data);

      return lastLocalSavedDate;
    }

    return '';
  }

  // originally from
  // https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-counter-plugin/src/WordCounter/index.js#L12
  getWordCount = (editorState) => {
    const plainText = editorState.getCurrentContent().getPlainText('');
    const regex = /(?:\r\n|\r|\n)/g; // new line, carriage return, line feed
    const cleanString = plainText.replace(regex, ' ').trim(); // replace above characters w/ space
    const wordArray = cleanString.match(/\S+/g); // matches words according to whitespace

    return wordArray ? wordArray.length : 0;
  }

  /**
  * @param {object} data.entityMap - draftJs entity maps - used by convertFromRaw
  * @param {object} data.blocks - draftJs blocks - used by convertFromRaw
  * set DraftJS Editor content state from blocks
  * contains blocks and entityMap
  */
  setEditorContentState = (data) => {
    const contentState = convertFromRaw(data);
    // eslint-disable-next-line no-use-before-define
    const editorState = EditorState.createWithContent(contentState, decorator);

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: 'TimedTextEditor',
        action: 'setEditorContentState',
        name: 'getWordCount',
        value: this.getWordCount(editorState)
      });
    }

    this.setState({ editorState });
  }

  // Helper function to re-render this component
  // used to re-render WrapperBlock on timecode offset change
  // or when show / hide preferences for speaker labels and timecodes change
  forceRenderDecorator = () => {
    // const { editorState, updateEditorState } = this.props;
    const contentState = this.state.editorState.getCurrentContent();
    const decorator = this.state.editorState.getDecorator();

    const newState = EditorState.createWithContent(
      contentState,
      decorator
    );

    // this.setEditorNewContentState(newState);
    const newEditorState = EditorState.push(newState, contentState);
    this.setState({ editorState: newEditorState });
  }

  /**
  * Update Editor content state
  */
  setEditorNewContentState = (newContentState) => {
    const newEditorState = EditorState.push(this.state.editorState, newContentState);
    this.setState({ editorState: newEditorState });
  }

  /**
   * Listen for draftJs custom key bindings
   */
  customKeyBindingFn = ( e) => {
    const enterKey = 13;
    if (e.keyCode === enterKey ) {
      return 'split-paragraph';
    }

    return getDefaultKeyBinding(e);
  }

  /**
   * Handle draftJs custom key commands
   */
  handleKeyCommand = (command) => {
    if (command === 'split-paragraph') {
      this.splitParagraph();
    }

    return 'not-handled';
  }

  /**
   * Helper function to handle splitting paragraphs with return key
   * on enter key, perform split paragraph at selection point.
   * Add timecode of next word after split to paragraph
   * as well as speaker name to new paragraph
   */
  splitParagraph = () => {
    // https://github.com/facebook/draft-js/issues/723#issuecomment-367918580
    // https://draftjs.org/docs/api-reference-selection-state#start-end-vs-anchor-focus
    const currentSelection = this.state.editorState.getSelection();
    // only perform if selection is not selecting a range of words
    // in that case, we'd expect delete + enter to achieve same result.
    if (currentSelection.isCollapsed()) {
      const currentContent = this.state.editorState.getCurrentContent();
      // https://draftjs.org/docs/api-reference-modifier#splitblock
      const newContentState = Modifier.splitBlock(currentContent, currentSelection);
      // https://draftjs.org/docs/api-reference-editor-state#push
      const splitState = EditorState.push(this.state.editorState, newContentState, 'split-block');
      const targetSelection = splitState.getSelection();

      const originalBlock = currentContent.blockMap.get(newContentState.selectionBefore.getStartKey());
      const originalBlockData = originalBlock.getData();
      const blockSpeaker = originalBlockData.get('speaker');

      let wordStartTime = 'NA';
      // eslint-disable-next-line prefer-const
      let isEndOfParagraph = false;
      // identify the entity (word) at the selection/cursor point on split.
      // eslint-disable-next-line prefer-const
      let entityKey = originalBlock.getEntityAt(currentSelection.getStartOffset());
      // if there is no word entity associated with a char then there is no entity key
      // at that selection point
      if (entityKey === null) {
        const closestEntityToSelection = this.findClosestEntityKeyToSelectionPoint(currentSelection, originalBlock);
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
        // if it's end of paragraph use end time of word for new paragraph
        wordStartTime = entityData.end;
      }
      else {
        wordStartTime = entityData.start;
      }
      // split paragraph
      // https://draftjs.org/docs/api-reference-modifier#mergeblockdata
      const afterMergeContentState = Modifier.mergeBlockData(
        splitState.getCurrentContent(),
        targetSelection,
        {
          'start': wordStartTime,
          'speaker': blockSpeaker
        }
      );
      this.setEditorNewContentState(afterMergeContentState);

      return 'handled';
    }

    return 'not-handled';
  }

  /**
   * Helper function for splitParagraph
   * to find the closest entity (word) to a selection point
   * that does not fall on an entity to begin with
   * Looks before if it's last char in a paragraph block.
   * After for everything else.
   */
  findClosestEntityKeyToSelectionPoint = (currentSelection, originalBlock) => {
    // set defaults
    let entityKey = null;
    let isEndOfParagraph = false;

    // selection offset from beginning of the paragraph block
    const startSelectionOffsetKey = currentSelection.getStartOffset();
    // length of the plain text for the ContentBlock
    const lengthPlainTextForTheBlock = originalBlock.getLength();
    // number of char from selection point to end of paragraph
    const remainingCharNumber = lengthPlainTextForTheBlock - startSelectionOffsetKey;
    // if it's the last char in the paragraph - get previous entity
    if (remainingCharNumber === 0 ) {
      isEndOfParagraph = true;
      for (let j = lengthPlainTextForTheBlock; j >0 ; j--) {
        entityKey = originalBlock.getEntityAt(j);
        if (entityKey!== null) {
          // if it finds it then return
          return { entityKey, isEndOfParagraph };
        }
      }
    }
    // if it's first char or another within the block - get next entity
    else {
      console.log('Main part of paragraph');
      let initialSelectionOffset = currentSelection.getStartOffset();
      for (let i = 0; i < remainingCharNumber ; i++) {
        initialSelectionOffset +=i;
        entityKey = originalBlock.getEntityAt(initialSelectionOffset);
        // if it finds it then return
        if (entityKey !== null) {
          return { entityKey, isEndOfParagraph };
        }
      }
    }

    // cover edge cases where it doesn't find it
    return { entityKey, isEndOfParagraph };
  }

  renderBlockWithTimecodes = () => {
    return {
      component: WrapperBlock,
      editable: true,
      props: {
        showSpeakers: this.state.showSpeakers,
        showTimecodes: this.state.showTimecodes,
        timecodeOffset: this.state.timecodeOffset,
        editorState: this.state.editorState,
        setEditorNewContentState: this.setEditorNewContentState,
        onWordClick: this.props.onWordClick,
        handleAnalyticsEvents: this.props.handleAnalyticsEvents
      }
    };
  }

  getCurrentWord = () => {
    const currentWord = {
      start: 'NA',
      end: 'NA'
    };

    if (this.state.transcriptData) {
      const contentState = this.state.editorState.getCurrentContent();
      // TODO: using convertToRaw here might be slowing down performance(?)
      const contentStateConvertEdToRaw = convertToRaw(contentState);
      const entityMap = contentStateConvertEdToRaw.entityMap;

      for (var entityKey in entityMap) {
        const entity = entityMap[entityKey];
        const word = entity.data;

        if (word.start <= this.props.currentTime && word.end >= this.props.currentTime) {
          currentWord.start = word.start;
          currentWord.end = word.end;
        }
      }
    }

    if (currentWord.start !== 'NA') {
      if (this.props.isScrollIntoViewOn) {
        const currentWordElement = document.querySelector(`span.Word[data-start="${ currentWord.start }"]`);
        currentWordElement.scrollIntoView({ block: 'center', inline: 'center' });
      }
    }

    return currentWord;
  }

  render() {
    const helpMessage = <div className={ style.helpMessage }>
      <span><FontAwesomeIcon className={ style.icon } icon={ faMousePointer } />Double click on a word or timestamp to jump to that point in the video.</span>
      <span><FontAwesomeIcon className={ style.icon } icon={ faICursor } />Start typing to edit text.</span>
      <span><FontAwesomeIcon className={ style.icon } icon={ faUserEdit } />You can add and change names of speakers in your transcript.</span>
      <span><FontAwesomeIcon className={ style.icon } icon={ faKeyboard } />Use keyboard shortcuts for quick control.</span>
      <span><FontAwesomeIcon className={ style.icon } icon={ faSave } />Save & export to get a copy to your desktop.</span>
    </div>;

    const tooltip = <Tooltip
      className={ style.help }
      content={ helpMessage }
      fadeDuration={ 250 }
      fadeEasing={ 'ease-in' }
      placement={ 'bottom' }
      radius={ 5 }>
      <FontAwesomeIcon className={ style.icon } icon={ faQuestionCircle } />
      How does this work?
    </Tooltip>;

    const currentWord = this.getCurrentWord();
    const highlightColour = '#69e3c2';
    const unplayedColor = '#767676';
    const correctionBorder = '1px dotted blue';

    // Time to the nearest half second
    const time = Math.round(this.props.currentTime * 4.0) / 4.0;

    const editor = (
      <section
        className={ style.editor }
        onDoubleClick={ event => this.handleDoubleClick(event) }>

        <style scoped>
          {`span.Word[data-start="${ currentWord.start }"] { background-color: ${ highlightColour }; text-shadow: 0 0 0.01px black }`}
          {`span.Word[data-start="${ currentWord.start }"]+span { background-color: ${ highlightColour } }`}
          {`span.Word[data-prev-times~="${ Math.floor(time) }"] { color: ${ unplayedColor } }`}
          {`span.Word[data-prev-times~="${ time }"] { color: ${ unplayedColor } }`}
          {`span.Word[data-confidence="low"] { border-bottom: ${ correctionBorder } }`}
        </style>

        <Editor
          editorState={ this.state.editorState }
          onChange={ this.onChange }
          stripPastedStyles
          blockRendererFn={ this.renderBlockWithTimecodes }
          handleKeyCommand={ command => this.handleKeyCommand(command) }
          keyBindingFn={ e => this.customKeyBindingFn(e) }
        />
      </section>
    );

    return (
      <section>
        { tooltip }
        { this.props.transcriptData !== null ? editor : null }
      </section>
    );
  }
}

// DraftJs decorator to recognize which entity is which
// and know what to apply to what component
const getEntityStrategy = mutability => (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
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
    component: Word,
  },
]);

TimedTextEditor.propTypes = {
  transcriptData: PropTypes.object,
  mediaUrl: PropTypes.string,
  isEditable: PropTypes.bool,
  onWordClick: PropTypes.func,
  sttJsonType: PropTypes.string,
  isPlaying: PropTypes.func,
  playMedia: PropTypes.func,
  currentTime: PropTypes.number,
  isScrollIntoViewOn: PropTypes.bool,
  isPauseWhileTypingOn: PropTypes.bool,
  timecodeOffset: PropTypes.number,
  handleAnalyticsEvents: PropTypes.func
};

export default TimedTextEditor;
