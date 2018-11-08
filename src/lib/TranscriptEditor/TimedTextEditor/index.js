import React from 'react';
import {
  // Draft,
  Editor,
  EditorState,
  // ContentState,
  CompositeDecorator,
  convertFromRaw
} from 'draft-js';

import Word from './Word';
import bbcKaldiToDraft from './adapters/bbc-kaldi/index.js';

import styles from './index.module.css';

class TimedTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      transcriptData: this.props.transcriptData
    };

    this.onChange = editorState => this.setState({ editorState });
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    // TODO: use currentTime info to highlight text in draftJs
    console.log('nextProps.currentTime',nextProps.currentTime);
    if(this.state.transcriptData === null){
      this.setState({
        transcriptData: nextProps.transcriptData
      },() => {
        this.loadData();
      }
    );
    }
  }

  loadData() {
    if (this.props.transcriptData !== null) {
      const blocks = bbcKaldiToDraft(this.props.transcriptData);
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

      this.setState({ editorState });
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

  render() {
    return (
        <section
        className={ styles.editor }
        onDoubleClick={ event => this.handleDoubleClick(event) }
        // onClick={ event => this.handleOnClick(event) }
        >
            <Editor
          editorState={ this.state.editorState }
          onChange={ this.onChange }
          stripPastedStyles
        />
            {/* <button onClick={() => this.loadData()}>load data</button> */}
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
