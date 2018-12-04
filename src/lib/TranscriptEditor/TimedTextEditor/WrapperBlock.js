import React from 'react';
import PropTypes from 'prop-types';
import { EditorBlock, Modifier, convertToRaw, EditorState, Editor, SelectionState } from 'draft-js';

import SpeakerLabel from './SpeakerLabel';

import style from './WrapperBlock.module.css';

class WrapperBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      speaker: '',
      start: ''
    };
  }

  componentDidMount() {
    const { block, contentState, editorState } = this.props;
    const speaker = block.getData().get('speaker');

    const start = block.getData().get('start');
    this.setState({
      speaker: speaker,
      start: start
    })
  }

  handleOnClickEdit = (e) => {
    const newSpeakerName = prompt('New Speaker Name?');

    if (newSpeakerName !== '') {
      this.setState({ speaker: newSpeakerName });

      // From docs: https://draftjs.org/docs/api-reference-selection-state#keys-and-offsets
      // selection points are tracked as key/offset pairs,
      // where the key value is the key of the ContentBlock where the point is positioned
      // and the offset value is the character offset within the block.

      // Get key of the currentBlock
      const keyForCurrentCurrentBlock = this.props.block.getKey();
      // create empty selection for current block
      // https://draftjs.org/docs/api-reference-selection-state#createempty
      const currentBlockSelection = SelectionState.createEmpty(keyForCurrentCurrentBlock);
      // move selection to current block
      const EditorStateWithSelectedCurrentBlock = EditorState.acceptSelection(this.props.blockProps.editorState, currentBlockSelection)

      const currentBlockSelectionState = EditorStateWithSelectedCurrentBlock.getSelection();
      // set new speaker data for block
      const newBlockDataWithSpeakerName = { speaker: newSpeakerName };
      // merge data
      // https://draftjs.org/docs/api-reference-modifier#mergeblockdata
      const newContentState = Modifier.mergeBlockData(
        this.props.contentState,
        currentBlockSelectionState,
        newBlockDataWithSpeakerName
      )
      // cb for saving editorState in TimedTextEditor
      this.props.blockProps.setEditorNewContentState(newContentState);
    }
  }

  handleTimecodeClick = (e) => {
    // convert to seconds
    this.props.blockProps.onWordClick(this.state.start);
  }

  render() {
    return (
      <div className={ style.WrapperBlock }>
        <span className={ style.SpeakerBlock }>
          <SpeakerLabel
            name={ this.state.speaker }
            handleOnClickEdit={ this.handleOnClickEdit }
          />
        </span>
        <br />
        <span className={ style.TimeBlock } onClick={ this.handleTimecodeClick }>{this.state.start}</span>
        <br />
        <EditorBlock { ...this.props } />
      </div>
    );
  }
}

export default WrapperBlock;
