import React from "react";
import PropTypes from "prop-types";

import {
  EditorState,
  // CompositeDecorator,
  convertFromRaw,
  convertToRaw,
  getDefaultKeyBinding,
  Modifier
} from "draft-js";


import CustomEditor from './CustomEditor.js';

import sttJsonAdapter from '../../stt-adapters';
import exportAdapter from '../../export-adapters';
import updateTimestamps from './UpdateTimestamps/index.js';
import style from './index.module.css';
 
// Helper function to find timing of a word 
// looking at the timing of the corrsponding word in STT
// this might be off when correcting the text, but not byt a lot ~
function findWordByCountOffset(wordsList, startWordPosition){
  try{
    // -1 to offset for the .length on before block and current block
    // and arrays starting from zero (?)
    const word = wordsList[startWordPosition-1]
    return word;
  }catch(e){
    console.error("Could not find word via 'fuzzy' search")
  }
}

class TimedTextEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      dpeWords: null
    };
  }

  componentDidMount() {
    this.loadData();
  }


  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps !== this.props) {
      return true;
    }
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
        // const alignedEditorState = this.updateTimestampsForEditorState(editorState);
        // this.setState({ editorState: alignedEditorState },
        this.setState({ editorState: editorState },
          ( ) => {
            if(this.props.isAutoSave){
              // TODO: comment out auto save if get performance issues
              const { editorState} = this.state;
              const format =  this.props.autoSaveContentType;
              const title = this.props.title;
              const data = exportAdapter(
                convertToRaw(editorState.getCurrentContent()),
                format,
                title
              );
              this.props.handleAutoSaveChanges({data, ext: format});
            }
          }
        );
      }, 1000);
    }

    if (this.props.isEditable) {
      this.setState({ editorState });
    }
  };

  updateTimestamps=async()=>{
    return new Promise((resolve, reject)=>{
      try{
        // https://developers.google.com/web/updates/2015/08/using-requestidlecallback
        // https://philipwalton.com/articles/idle-until-urgent/
        requestIdleCallback(()=>{
          const alignedEditorState = this.updateTimestampsForEditorState();
           this.setState({ editorState: alignedEditorState }, ()=>{
             resolve()
           })
        }, { timeout: 1000 }
        );
    
      }catch(e){
        reject(e)
      }
    })
  }

  // updateTimestampsForEditorState doesn't have side effects
  // it returns editor state, that can then be used to update state 
  updateTimestampsForEditorState = (editorStateInput) =>{
    const editorStateFromState  = this.state.editorState;
    let editorState = editorStateInput? editorStateInput : editorStateFromState;
    // Update timestamps according to the original state.
    // const currentContent = convertToRaw(
    //   editorState.getCurrentContent()
    // );
    const currentContent = editorState.getCurrentContent()
    // https://draftjs.org/docs/api-reference-content-state/#getplaintext


    const updatedContentRaw = updateTimestamps(
      currentContent,
      this.state.dpeWords
    );
    const updatedContent = convertFromRaw(updatedContentRaw);
    // Update editor state
    const newEditorState = EditorState.push(
      editorState,
      updatedContent
    );
    // Re-convert updated content to raw to gain access to block keys
    const updatedContentBlocks = convertToRaw(updatedContent);
    // Get current selection state and update block keys
    const selectionState = editorState.getSelection();
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
      return newEditorStateSelected;
    } else {
      return newEditorState;
    }
  }

  loadData() {
    if (this.props.transcriptData !== null) {
      const blocks = sttJsonAdapter(
        this.props.transcriptData,
        this.props.sttJsonType
      );

      this.setEditorContentState(blocks);

      const backupStateDPE = exportAdapter(blocks, 'digitalpaperedit','json');
      const dpeWords = backupStateDPE.data.words;
      // because commented out alignement for performance boost on longer transcript
      // the list of words to use to enabledouble click on word jump ~ corresponding point in media 
      // (fuzzy correspondence using position of word from start of transcript - better then nothing)
      this.setState({ dpeWords });
    }
  }

  getEditorContent(exportFormat, title) {
    const format = exportFormat || 'draftjs';
    const {editorState} = this.state;
    const alignedEditorState = this.updateTimestampsForEditorState(editorState);
    this.setState({editorState: alignedEditorState});
      return exportAdapter(
        convertToRaw(alignedEditorState.getCurrentContent()),
        format,
        title
      );
  }

  // click on words - for navigation
  // eslint-disable-next-line class-methods-use-this
  handleDoubleClick = event => {
    const { editorState } = this.state;
    const selectionState = editorState.getSelection();
    const anchorKey = selectionState.getAnchorKey();
    const currentContent = editorState.getCurrentContent();
    // getting current paragraph block 
    const currentContentBlock = currentContent.getBlockForKey(anchorKey);
    // getting offset in char count of the start of the selection/click in current paragraph block
    const selectionStart = selectionState.getStartOffset();
    // converting offset in chart count into a word count by getting text chunk of text before selection/click
    const textBeforeSelectionInCurrentBlock = currentContentBlock.getText().slice(0,selectionStart); 
    // splitting text chunk on space to get a word count
    const wordCountBeforeSelectionInCurrentBlock = textBeforeSelectionInCurrentBlock.split(' ').length;

    // If block has got data associated with it,
    // keep it simple and look for currentBlockDataWords info within the available data
    // we use the wordCountBeforeSelectionInCurrentBlock to the corresponding word in STT
    const currentBlockData = currentContentBlock.getData();
    const currentBlockDataWords = currentBlockData.get('words');
    if(currentBlockDataWords){
      const wordResult = currentBlockDataWords[wordCountBeforeSelectionInCurrentBlock-1]
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
      // After running realignement, it might be the case that block always has data
      // but for a paragraph/block that has been edited, and before alignement, 
      // it might lose the word data associated with it
      // so we get all the blocks
      const blocksAsArray = currentContent.getBlocksAsArray();
      // find the current block
      const currentBlockIndex = blocksAsArray.findIndex((block)=>{
        return currentContentBlock.getKey()=== block.getKey()
      }) 
      // segment array of blocks so that you only have the preceeding paragraph/blocks
      const blocksAsArraySliced = blocksAsArray.slice(0,currentBlockIndex);
      // calculate a word count offset for the previous paragraphs. 
      // eg how many words are in theh paragraphs before 
      let wordsCountPreviousBlocks = 0;
      blocksAsArraySliced.map((block)=>{
        const wordCountInBlock = block.getText().split(' ').length;
        wordsCountPreviousBlocks += wordCountInBlock;
      })

      // if we add how many words are in the paragraph before with how many are in the current one
      // we have our total offset count for the word we clicked on
      const totalOffsetCountForWord =  wordsCountPreviousBlocks + wordCountBeforeSelectionInCurrentBlock;
      // se use the original STT timed data to get a start time for our word, via the offset count we just calculated
      // in other words, the corresponding of a word in the human accurate transcript, will be roughly close where
      // the STT has recognised a word (even if that word is inaccurate) - keyword beign roughly, we are not 
      // looking to get exactly to that point, but to approximate that time, so that we can scrube back and forth
      // to listen to the audio we want to transcribe at that word.
      const dpeWordsWithChar = this.state.dpeWords;
      const currentDPEWord = findWordByCountOffset(dpeWordsWithChar,totalOffsetCountForWord); 
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
     const editorState = EditorState.createWithContent(contentState);
    // this.setState({ editorState });
    // TODO: ?
    this.setState({ editorState }, ()=>{	
      this.forceRenderDecorator();	
    });
    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: "TimedTextEditor",
        action: "setEditorContentState",
        name: "getWordCount",
        value: this.getWordCount(editorState)
      });
    }


  };

  /**
   * Update Editor content state
   */
  setEditorNewContentState = newContentState => {
    const newState = EditorState.createWithContent(newContentState);
    const editorState = EditorState.push(
      newState,
      newContentState
    );
    this.setState((prevState)=>{ 
      const selectionState = prevState.editorState.getSelection();
        if (selectionState.getHasFocus()) {
          const selection = selectionState.merge({
            anchorOffset: selectionState.getAnchorOffset(),
            // anchorKey: blockMap[selectionState.getAnchorKey()],
            focusOffset: selectionState.getFocusOffset(),
            // focusKey: blockMap[selectionState.getFocusKey()]
          });

          const newEditorStateSelected = EditorState.forceSelection(
            editorState,
            selection
          );
          // const alignedEditorState =  this.updateTimestampsForEditorState(newEditorStateSelected);
          // return { editorState: alignedEditorState } 
          return { editorState: newEditorStateSelected } 
        }else{
          // const alignedEditorState =  this.updateTimestampsForEditorState(editorState);
          // return { editorState: alignedEditorState } 
          return { editorState: editorState } 
        }
      },
      ()=>{
        if(this.props.isAutoSave){
          // TODO: comment out auto save if get performance issues
          const { editorState } = this.state;
          const format =  this.props.autoSaveContentType;
          const title = this.props.title;
          const data = exportAdapter(
            convertToRaw(editorState.getCurrentContent()),
            format,
            title
          );
          this.props.handleAutoSaveChanges({data, ext: format});
       }
    });
  };

  setEditorNewContentStateSpeakersUpdate = newContentState => {
    const newState = EditorState.createWithContent(newContentState);
    const editorState = EditorState.push(
      newState,
      newContentState
    );

    this.setState(
      () => ({
        editorState
      }),
      () => {
        if(this.props.isAutoSave){
          // TODO: comment out auto save if get performance issues
          const format =  this.props.autoSaveContentType;
          const title = this.props.title;
          const data = exportAdapter(
            convertToRaw(editorState.getCurrentContent()),
            format,
            title
          );
          this.props.handleAutoSaveChanges({data, ext: format});
        }
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
    if (e.keyCode === enterKey) {	

      return "split-paragraph";	
    }
    // if alt key is pressed in combination with these other keys
    if (
      e.altKey &&
      (e.keyCode === enterKey ||
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

      return "keyboard-shortcuts";
    }

    return getDefaultKeyBinding(e);
  };

   /**	
   * Handle draftJs custom key commands	
   */	
  handleKeyCommand = command => {	
    if (command === 'split-paragraph') {	
      this.handleSplitParagraph();	
    }

    if (command === "keyboard-shortcuts") {	
      return "handled";	
    }	
    return 'not-handled';	
  };	

  /**	
   * Helper function to handle splitting paragraphs with return key	
   * on enter key, perform split paragraph at selection point.	
   * Add timecode of next word after split to paragraph	
   * as well as speaker name to new paragraph	
   * TODO: move into its own file as helper function	
   */	
  handleSplitParagraph = () => {	
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
   * Helper function for handleSplitParagraph
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

  onWordClick = e => {
    this.props.onWordClick(e);
  };

  forceRenderDecorator = () => {	
    const contentState = this.state.editorState.getCurrentContent();	
    const decorator = this.state.editorState.getDecorator();	
    const newState = EditorState.createWithContent(contentState, decorator);	
    const newEditorState = EditorState.push(newState, contentState);	
    this.setState({ editorState: newEditorState });	
  };

  render() {
    const unplayedColor = "#767676";
    // Time to the nearest half second
    const time = Math.floor(Math.round(this.props.currentTime * 4.0) / 4.0);
    console.log('time', time);
    if (this.props.isScrollIntoViewOn) {
      const cssSelector =  `[data-start-srcoll-sync~="${ time }"]`;
      console.log('cssSelector', cssSelector);
      const currentParagraphElement = document.querySelector(cssSelector);
      console.log('currentParagraphElement')
      if(currentParagraphElement){
        currentParagraphElement.scrollIntoView({
          block: 'nearest',
          inline: 'center'
        });
      }
    
    }

    const editor = (
      <section
        className={style.editor}
        onDoubleClick={this.handleDoubleClick}
      >
        <style scoped>
          {`.paragraph[data-prev-times~="${ time }"] { color: ${ unplayedColor } }`}
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