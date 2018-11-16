import React from 'react';
import {
  // Draft,
  Editor,
  EditorState,
  // ContentState,
  CompositeDecorator,
  convertFromRaw,
  convertToRaw
} from 'draft-js';

import Word from './Word';
import sttJsonAdapter from './adapters/index.js';
import styles from './index.module.css';

class TimedTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      transcriptData: this.props.transcriptData,
      isEditable: this.props.isEditable,
      sttJsonType: this.props.sttJsonType
    };

    this.onChange = (editorState) =>{
      // DraftJs option editable
      if(this.state.isEditable){
        this.setState({ editorState });
      }
    } 
  }

  componentDidMount() {
    this.loadData();
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.transcriptData !== null){
      return {
        transcriptData: nextProps.transcriptData,
        isEditable: nextProps.isEditable
      }
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {

    if(prevState.transcriptData !== this.state.transcriptData){
      this.loadData();
    }
  }

  loadData() {
    if (this.props.transcriptData !== null) {
      const blocks = sttJsonAdapter(this.props.transcriptData, this.props.sttJsonType);
      this.setEditorContentState(blocks)
    }
  }
  // click on words - for navigation 
  // eslint-disable-next-line class-methods-use-this
  handleDoubleClick = (event)=> {
    // nativeEvent --> React giving you the DOM event 
    let element = event.nativeEvent.target;
    // find the parent in Word that contains span with time-code start attribute
    while (!element.hasAttribute('data-start') && element.parentElement) {
      element = element.parentElement;
    }

    if (element.hasAttribute('data-start')) {
      const t = parseFloat(element.getAttribute('data-start'));
      //TODO: prop to jump to video <-- To connect with MediaPlayer
      // this.props.seek(t);
      this.props.onWordClick(t);
      // TODO: pass current time of media to TimedTextEditor to know what text to highlight in this component  
    }
  }

  localSave(mediaUrl){
    console.log('localSave',mediaUrl)
    const data = convertToRaw(this.state.editorState.getCurrentContent());
    // console.log(data)
    localStorage.setItem(`draftJs-${ mediaUrl }`, JSON.stringify(data));
    const newLastLocalSavedDate  =  new Date().toString();
    localStorage.setItem(`timestamp-${ mediaUrl }`, newLastLocalSavedDate);
    return newLastLocalSavedDate;
  }

  // eslint-disable-next-line class-methods-use-this
  isPresentInLocalStorage(mediaUrl){
    const data = localStorage.getItem(`draftJs-${ mediaUrl }`);
    if(data !== null){
      return true;
    }else{
      return false;
    }
  }

  loadLocalSavedData(mediaUrl){
    console.log('loadLocalSavedData', mediaUrl);
    const data = JSON.parse(localStorage.getItem(`draftJs-${ mediaUrl }`));
    if(data !== null){
      const lastLocalSavedDate = localStorage.getItem(`timestamp-${ mediaUrl }`);
      this.setEditorContentState(data.blocks)
      return lastLocalSavedDate;
    } else{
      return ''
    }
  }

  // set DraftJS Editor content state from blocks
  setEditorContentState = (blocks) => {
    const entityRanges = blocks.map(block => block.entityRanges);
    // eslint-disable-next-line no-use-before-define
    const flatEntityRanges = flatten(entityRanges);
    
    const entityMap = {};

    flatEntityRanges.forEach((data) => {
      entityMap[ data.key ] = {
          type: 'WORD',
          mutability: 'MUTABLE',
          data
        }
    });
    const contentState = convertFromRaw({ blocks, entityMap });
    // eslint-disable-next-line no-use-before-define
    const editorState = EditorState.createWithContent(contentState, decorator);
    this.setState({ editorState: editorState });
  }

  getEditorContent = (sttType) =>{
    // sttType used in conjunction with adapter/convert
    if(sttType === null){
      sttType = 'draftjs';
    }

    // if(sttType === 'draftJs'){
      const data = convertToRaw(this.state.editorState.getCurrentContent());
      return data;
    // }
  }

  render() {
    return (
        <section >
            
            <section
                className={ styles.editor }
                onDoubleClick={ event => this.handleDoubleClick(event) }
                // onClick={ event => this.handleOnClick(event) }
                >
                {/* <p> {JSON.stringify(this.state.transcriptData)}</p> */}
                <Editor
              editorState={ this.state.editorState }
              onChange={ this.onChange }
              stripPastedStyles
            /> 
            
            </section>
        </section>
    );
  }
}

// converts nested arrays into one dimensional array 
const flatten = list =>
  list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

// DraftJs decorator to recognize which entity is which 
// and know what to apply to what component 
const getEntityStrategy = mutability => (contentBlock, callback, contentState) => {
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

export default TimedTextEditor;
