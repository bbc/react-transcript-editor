import React from 'react';
import PropTypes from 'prop-types';
import { EditorBlock, Modifier, convertToRaw, EditorState } from 'draft-js';

import SpeakerLabel from './SpeakerLabel';

class WrapperBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      speaker: 'null',
      start: '00:00:00'
    };
  }

  componentDidMount() {
    const { block, contentState, editorState } = this.props;
    // console.log(this.props.blockProps)
    const speaker = block.getData().get('speaker');
    const start = block.getData().get('start');
    // const blockKey = block.getKey();
    // const entity = contentState.getEntity(blockKey);
  
  //   console.log('contentState',blockKey);
    this.setState({
      speaker: speaker,
      start: start
    })
  }

  handleOnClickEdit = (e) => {
    const newSpeakerName = prompt('New Speaker Name?')

    this.setState({ speaker: newSpeakerName });

    const selectionState = this.props.blockProps.editorState.getSelection();
    //   // https://draftjs.org/docs/api-reference-modifier#mergeblockdata
    const newBlockData = { speaker: newSpeakerName };
    // https://stackoverflow.com/questions/47604432/how-to-insert-upload-image-update-entity-and-blocks-in-draft-js
    const newContentState = Modifier.mergeBlockData(
      this.props.contentState,
      selectionState,
      newBlockData//blockData
    )
    // TODO: new newContentState
    const tmpRaw = convertToRaw(newContentState);
    console.log(JSON.stringify(tmpRaw,null,2)); 
    const newEditorState = EditorState.push(this.props.blockProps.editorState, newContentState);
    // TODO: this last step of saving the stage needs to happen in TimedTextEditor
    // this.setState({ editorState: newEditorState });
  }

  render() {
    return (
      <div className="WrapperBlock">
        <span className="SpeakerBlock">
          <SpeakerLabel
          name={ this.state.speaker }
          handleOnClickEdit={ this.handleOnClickEdit }
          />
        </span>

        <br />
        <span className="TimeBlock"> {this.state.start} </span>
        <br />
        <EditorBlock { ...this.props } />
      </div>
    );
  }
}

export default WrapperBlock;
