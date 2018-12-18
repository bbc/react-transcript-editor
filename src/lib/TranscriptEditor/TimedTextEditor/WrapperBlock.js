import React from 'react';
import { EditorBlock, Modifier, EditorState, SelectionState } from 'draft-js';

import SpeakerLabel from './SpeakerLabel';
import { shortTimecode } from '../../Util/timecode-converter/';

import style from './WrapperBlock.module.css';

class WrapperBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      speaker: '',
      start: 0
    };
  }

  componentDidMount() {
    const { block } = this.props;
    const speaker = block.getData().get('speaker');

    const start = block.getData().get('start');
    this.setState({
      speaker: speaker,
      start: start
    });
  }

  handleOnClickEdit = () => {
    const newSpeakerName = prompt('New Speaker Name?');
    if (newSpeakerName !== '' && newSpeakerName !== null) {
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
      const EditorStateWithSelectedCurrentBlock = EditorState.acceptSelection(this.props.blockProps.editorState, currentBlockSelection);

      const currentBlockSelectionState = EditorStateWithSelectedCurrentBlock.getSelection();
      // set new speaker data for block
      const newBlockDataWithSpeakerName = { speaker: newSpeakerName };
      // merge data
      // https://draftjs.org/docs/api-reference-modifier#mergeblockdata
      const newContentState = Modifier.mergeBlockData(
        this.props.contentState,
        currentBlockSelectionState,
        newBlockDataWithSpeakerName
      );
      // cb for saving editorState in TimedTextEditor
      this.props.blockProps.setEditorNewContentState(newContentState);
    }
  }

  handleTimecodeClick = () => {
    this.props.blockProps.onWordClick(this.state.start);
  }

  render() {
    return (
      <div className={ style.WrapperBlock }>
        <div className={ style.markers }>
          <SpeakerLabel
            name={ this.state.speaker }
            handleOnClickEdit={ this.handleOnClickEdit }
          />
          <span className={ style.time } onClick={ this.handleTimecodeClick }>{shortTimecode(this.state.start)}</span>
        </div>
        <div className={ style.text }>
          <EditorBlock { ...this.props } />
        </div>
      </div>
    );
  }
}

export default WrapperBlock;
