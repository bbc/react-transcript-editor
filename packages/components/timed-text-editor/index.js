import React from "react";
import PropTypes from "prop-types";

import {
  EditorState,
  CompositeDecorator,
  convertFromRaw,
  convertToRaw,
  getDefaultKeyBinding,
  Modifier
} from "draft-js";


import CustomEditor from './CustomEditor.js';
import Word from './Word';

import sttJsonAdapter from '../../stt-adapters';
import exportAdapter from '../../export-adapters';
import updateTimestamps from './UpdateTimestamps/index.js';
import style from './index.module.css';

// https://jsfiddle.net/pietrops/sakr9uLo/
function addCharOffsetToWordsInTranscript(wordsList) {
  let charOffset = 0;
  return wordsList.map((word) => {
    word.charOffsetStart = charOffset;
    // +1 to accoutn for space after word 
    charOffset += (word.text.length + 1);
    word.charOffsetEnd = charOffset;
    return word;
  })
}

function findWordByCharOffset(wordsList, startCharPosition, endCharPosition) {
  // To make it more fuzzy it could also be find first word that
  // endCharPosition >= word.charOffsetEnd
  // eg if you introduce things like ~Speaker~ and new lines, then 
  // the correspondence char offset and word in STT transcript
  // might no longer be exact 
  return wordsList.find((word) => {
    return startCharPosition >= word.charOffsetStart 
    && endCharPosition <= word.charOffsetEnd
  })
}

function findWordByCharOffsetStart(wordsList, startCharPosition, endCharPosition) {
  // To make it more fuzzy it could also be find first word that
  // endCharPosition >= word.charOffsetEnd
  // eg if you introduce things like ~Speaker~ and new lines, then 
  // the correspondence char offset and word in STT transcript
  // might no longer be exact 
  return wordsList.find((word) => {
    return startCharPosition >= word.charOffsetStart 
    // && endCharPosition <= word.charOffsetEnd
  })
}

class TimedTextEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      depWordsWithCharOffset: null
    };
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

      if (this.saveTimer !== undefined) {
        clearTimeout(this.saveTimer);
      }
      this.saveTimer = setTimeout(() => {
        this.setState(
          () => ({
            editorState
          }),
          () => {
            // TODO: Comment out auto save for performance 
            const data = this.updateTimestampsForEditorState();
            // const data = this.getEditorContent( this.props.autoSaveContentType, this.props.title);
            this.props.handleAutoSaveChanges(data);
          }
        );
      }, 1000);
    }

    if (this.props.isEditable) {
      this.setState({ editorState });
    }
  };

  updateTimestampsForEditorState() {
    // Update timestamps according to the original state.
    const currentContent = convertToRaw(
      this.state.editorState.getCurrentContent()
    );
    const updatedContentRaw = updateTimestamps(
      currentContent,
      this.state.depWordsWithCharOffset
    );
    const updatedContent = convertFromRaw(updatedContentRaw);

    // Update editor state
    const newEditorState = EditorState.push(
      this.state.editorState,
      updatedContent
    );

    // Re-convert updated content to raw to gain access to block keys
    const updatedContentBlocks = convertToRaw(updatedContent);

    // Get current selection state and update block keys
    const selectionState = this.state.editorState.getSelection();

    // Check if editor has currently the focus. If yes, keep current selection.
    if (selectionState.getHasFocus()) {
      // Build block map, which maps the block keys of the previous content to the block keys of the
      // updated content.
      var blockMap = {};
      for (
        var blockIdx = 0;
        blockIdx < currentContent.blocks.length;
        blockIdx++
      ) {
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
      const newEditorStateSelected = EditorState.forceSelection(
        newEditorState,
        selection
      );
      this.setState({ editorState: newEditorStateSelected });
      return newEditorStateSelected;
    } else {
      this.setState({ editorState: newEditorState });
      return newEditorState;
    }
  }

  loadData() {
    if (this.props.transcriptData !== null) {
      const blocks = sttJsonAdapter(
        this.props.transcriptData,
        this.props.sttJsonType
      );
      // TODO: did we need to  convertToRaw(convertFromRaw()) ? commenting out for now
      // this.setState({ originalState: convertToRaw(convertFromRaw(blocks)) });

      const backupStateDPE = exportAdapter(blocks, 'digitalpaperedit','json');
      const dpeWords = backupStateDPE.data.words;
      const depWordsWithCharOffset = addCharOffsetToWordsInTranscript(dpeWords)
      this.setState({ originalState: blocks, depWordsWithCharOffset });
      this.setEditorContentState(blocks);
    }
  }

  getEditorContent(exportFormat, title) {
    const format = exportFormat || 'draftjs';
    const tmpEditorState = this.updateTimestampsForEditorState();
    console.log('tmpEditorState', tmpEditorState);
    return exportAdapter(
      convertToRaw(tmpEditorState.getCurrentContent()),
      format,
      title
    );
  }

  // click on words - for navigation
  // eslint-disable-next-line class-methods-use-this
  handleDoubleClick = event => {
    // console.log('handleDoubleClick',event)
    const { editorState } = this.state;
    var selectionState = editorState.getSelection();
    var anchorKey = selectionState.getAnchorKey();
    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    var start = selectionState.getStartOffset();
    var end = selectionState.getEndOffset();

    // If block has got data, keep it simple and look forcurrentBlockDataWords info withing the available data
    const currentBlockData = currentContentBlock.getData();
    const currentBlockDataWords = currentBlockData.get('words');
    if(currentBlockDataWords){
      let charCount = 0;
      const wordResult = currentBlockDataWords.find((word,index)=>{
        const res = charCount >= start && charCount <= end;
        // TODO: issue with BBC kaldi and and word/punct attribute 
        // (only punct has got punctuation) - ideally this should be changed in
        // stt adapter for BBC Kaldi to keep consistency 
        if(word.punct){
          charCount += (word.punct.length+1);
        }else{
          charCount += (word.word.length+1);
        }
        return res
      })

      if(wordResult){
        this.props.onWordClick(wordResult.start);
      }
      else{
        // TODO: if it doesn't find a word
        // or figure out how ot handle edge case 
        console.error('could not find word')
      }
    } else {
      // If it the paragraph block does not have word data info 
      const blocksAsArray = currentContent.getBlocksAsArray();
      const currentBlockIndex = blocksAsArray.findIndex((block)=>{
        return currentContentBlock.getKey()=== block.getKey()
      }) 
      const blocksAsArrayLenght = blocksAsArray.length;
      // segment array of blocks so that you only have the preceeding blocks
      const blocksAsArraySliced = blocksAsArray.slice(0,currentBlockIndex);
      let charCountPreviousBlocks = 0;
      blocksAsArraySliced.map((block)=>{
        const blockLength = block.getText().length+1;
        charCountPreviousBlocks += blockLength;
      })

      const dpeWordsWithChar = this.state.depWordsWithCharOffset;
      const currentDPEWord = findWordByCharOffset(dpeWordsWithChar, charCountPreviousBlocks+start, charCountPreviousBlocks+end) 
      console.log('currentDPEWord',currentDPEWord)
      if(currentDPEWord){
        this.props.onWordClick(currentDPEWord.start);
      }else{
        console.error('could not find word')
      }
    }
  };

  // originally from
  // https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-counter-plugin/src/WordCounter/index.js#L12
  getWordCount = editorState => {
    const plainText = editorState.getCurrentContent().getPlainText('');
    const regex = /(?:\r\n|\r|\n)/g; // new line, carriage return, line feed
    const cleanString = plainText.replace(regex, " ").trim(); // replace above characters w/ space
    const wordArray = cleanString.match(/\S+/g); // matches words according to whitespace

    return wordArray ? wordArray.length : 0;
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

    // TODO: could also remove the word decorator all together?
     // const editorState = EditorState.createWithContent(contentState);
    const editorState = EditorState.createWithContent(contentState, decorator);
   

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: "TimedTextEditor",
        action: "setEditorContentState",
        name: "getWordCount",
        value: this.getWordCount(editorState)
      });
    }

    this.setState({ editorState }, ()=>{
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
        // TODO: comment out auto save 
        const format =  this.props.autoSaveContentType;
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
    const deleteKey = 8;
    const spaceKey = 32;
    const kKey = 75;
    const lKey = 76;
    const jKey = 74;
    const equalKey = 187; //used for +
    const minusKey = 189; // -
    const rKey = 82;
    const tKey = 84;
console.log('e.keyCode',e.keyCode)
    if (e.keyCode === enterKey) {	
      console.log('customKeyBindingFn split-paragraph');	

      return "split-paragraph";	
    }

    // if (e.keyCode === deleteKey) {	
    //   console.log('customKeyBindingFn handle-delete');	
    
    //   return "handle-delete";	
    // }

    // if alt key is pressed in combination with these other keys
    if (
      e.altKey &&
      (e.keyCode === enterKey ||
        e.keyCode === spaceKey ||
        // e.keyCode === deleteKey ||
        e.keyCode === kKey ||
        e.keyCode === lKey ||
        e.keyCode === jKey ||
        e.keyCode === equalKey ||
        e.keyCode === minusKey ||
        e.keyCode === rKey ||
        e.keyCode === tKey)
    ) {
      e.preventDefault();

      return "keyboard-shortcuts";
    }

    return getDefaultKeyBinding(e);
  };

   /**	
   * Handle draftJs custom key commands	
   */	
  handleKeyCommand = command => {	
    if (command === 'split-paragraph') {	
      this.splitParagraph();	
    }	

    // if (command === 'handle-delete') {	
    //   this.handleDelete();	
    // }	

    if (command === "keyboard-shortcuts") {	
      return "handled";	
    }	
    return 'not-handled';	
  };	

  // handleDelete = () =>{
  //   console.log('handle delete');
  //   const currentContent = this.state.editorState.getCurrentContent();
  //   const currentSelection = this.state.editorState.getSelection();	
  //   const originalBlock = currentContent.blockMap.get(	
  //     currentContent.selectionBefore.getStartKey()	
  //   );	
  //   const blockLength = originalBlock.getLength();
  //   var endSelectionOffsetInCurrentBlock = currentSelection.getEndOffset();
  //   var startSelectionOffsetInCurrentBlock = currentSelection.getStartOffset();
  //       // if cursor is at beginnign of end of paragraph block 
  //     // pressing enter would create an empty block
  //     // this can create issues 
  //     // so this stops it from happening 
  //     console.log('startSelectionOffsetInCurrentBlock',startSelectionOffsetInCurrentBlock)
  //     console.log('endSelectionOffsetInCurrentBlock',endSelectionOffsetInCurrentBlock)
  //     console.log('blockLength',blockLength)
  //     if(endSelectionOffsetInCurrentBlock === blockLength 
  //       || startSelectionOffsetInCurrentBlock === 0 ){
  //       console.log('Beginnign or end of block ')
  //       return "not-handled";	
  //     }
  //     return "handled";	
  // }
  /**	
   * Helper function to handle splitting paragraphs with return key	
   * on enter key, perform split paragraph at selection point.	
   * Add timecode of next word after split to paragraph	
   * as well as speaker name to new paragraph	
   * TODO: move into its own file as helper function	
   */	
  splitParagraph = () => {	
    console.log('splitParagraph')
    // https://github.com/facebook/draft-js/issues/723#issuecomment-367918580	
    // https://draftjs.org/docs/api-reference-selection-state#start-end-vs-anchor-focus	
    const currentSelection = this.state.editorState.getSelection();	
    // only perform if selection is not selecting a range of words	
    // in that case, we'd expect delete + enter to achieve same result.	
    if (currentSelection.isCollapsed()) {	
      const currentContent = this.state.editorState.getCurrentContent();	
      // https://draftjs.org/docs/api-reference-modifier#splitblock	
      const newContentState = Modifier.splitBlock(	
        currentContent,	
        currentSelection	
      );	
      // https://draftjs.org/docs/api-reference-editor-state#push	
      const splitState = EditorState.push(	
        this.state.editorState,	
        newContentState,	
        'split-block'	
      );	
      const targetSelection = splitState.getSelection();	

      const originalBlock = currentContent.blockMap.get(	
        newContentState.selectionBefore.getStartKey()	
      );	

      var endSelectionOffsetInCurrentBlock = currentSelection.getEndOffset();
      var startSelectionOffsetInCurrentBlock = currentSelection.getStartOffset();
    
      const blockLength = originalBlock.getLength();

      if(endSelectionOffsetInCurrentBlock !== startSelectionOffsetInCurrentBlock){
        if(endSelectionOffsetInCurrentBlock === blockLength ||endSelectionOffsetInCurrentBlock==0 ){
          return "not-handled";	
        }
      }
     
   
      // if select a whole paragraph then hit delete, these could cause an 
      // empty paragraph and that could cause probelms 
      console.log('startSelectionOffsetInCurrentBlock',startSelectionOffsetInCurrentBlock)
      console.log('endSelectionOffsetInCurrentBlock',endSelectionOffsetInCurrentBlock)
      console.log('blockLength',blockLength)
      if(endSelectionOffsetInCurrentBlock === blockLength 
        || startSelectionOffsetInCurrentBlock === 0 ){
        console.log('Beginnign or end of block ')
        return "not-handled";	
      }

         // if cursor is at beginnign of end of paragraph block 
      // pressing enter would create an empty block
      // this can create issues 
      // so this stops it from happening 
      const originalBlockData = originalBlock.getData();	
      if(originalBlockData){
          const blockSpeaker = originalBlockData.get("speaker");	
          // split paragraph	
          // https://draftjs.org/docs/api-reference-modifier#mergeblockdata	
          const afterMergeContentState = Modifier.mergeBlockData(	
            splitState.getCurrentContent(),	
            targetSelection,	
            {	
              speaker: blockSpeaker	
            }	
          );	
          this.setEditorNewContentState(afterMergeContentState);	

          return "handled";	
      }
      return "handled";	
    }	

    return 'not-handled';	
  };

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
        // if it finds it then return
        if (entityKey !== null) {
          return { entityKey, isEndOfParagraph };
        }
      }
    }

    // cover edge cases where it doesn't find it
    return { entityKey, isEndOfParagraph };
  };

  getCurrentWord = () => {
    const currentWord = {
      start: "NA",
      end: "NA"
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

    if (currentWord.start !== "NA") {
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

  render() {
    // console.log('render TimedTextEditor');
    const currentWord = this.getCurrentWord();
    const highlightColour = "#69e3c2";
    const unplayedColor = "#767676";
    const correctionBorder = "1px dotted blue";

    // Time to the nearest half second
    const time = Math.round(this.props.currentTime * 4.0) / 4.0;

    const editor = (
      <section
        className={style.editor}
        onDoubleClick={this.handleDoubleClick}
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
        <CustomEditor
          editorState={this.state.editorState}
          onChange={this.onChange}
          stripPastedStyles
          handleKeyCommand={this.handleKeyCommand}
          customKeyBindingFn={this.customKeyBindingFn}
          spellCheck={this.props.spellCheck}
          showSpeakers={this.props.showSpeakers}
          showTimecodes={this.props.showTimecodes}
          timecodeOffset={this.props.timecodeOffset}
          setEditorNewContentStateSpeakersUpdate={this.setEditorNewContentStateSpeakersUpdate}
          onWordClick={this.onWordClick}
          handleAnalyticsEvents={this.props.handleAnalyticsEvents}
          isEditable={this.props.isEditable}
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