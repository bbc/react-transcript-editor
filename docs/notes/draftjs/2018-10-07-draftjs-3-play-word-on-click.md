
# TimedTextEditor

Code example of `TimedTextEditor` with on click handler to trigger play of media at current word time code.

The playing of the media is done through the `MediaPlayer` Component through the sibling through parent communication through `TranscriptEditor` component.

```js
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
    // this.handleDoubleClick.bind(this);
    this.handleOnClick.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillReceiveProps(nexProps) {
    this.setState({
        transcriptData: nexProps.transcriptData
      },
      () => {
        this.loadData();
      }
    );
  }

  loadData() {
    if (this.props.transcriptData !== '') {
      const blocks = bbcKaldiToDraft(this.props.transcriptData);
      const entityRanges = blocks.map(block => block.entityRanges);
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

      const editorState = EditorState.createWithContent(
        contentState,
        decorator
      );

      this.setState({ editorState });
    }
  }

  // click on words - for navigation
  // eslint-disable-next-line class-methods-use-this
  handleOnClick(event) {
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
      console.log('---------');
      console.log('1.TimedTextEditor - handleOnClick ',t);
      // TODO: pass current time of media to TimedTextEditor to know what text to highlight in this component  
    }
  }

  render() {
    return (
        <section
        className={ styles.editor }
        // onDoubleClick={event => this.handleDoubleClick(event)}
        onClick={ event => this.handleOnClick(event) }
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

```
