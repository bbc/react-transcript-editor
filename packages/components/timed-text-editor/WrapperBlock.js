import React from 'react';
import { EditorBlock, Modifier, EditorState, SelectionState } from 'draft-js';

import SpeakerLabel from './SpeakerLabel';
// import { shortTimecode, secondsToTimecode } from '../../Util/timecode-converter/';

import {
  shortTimecode,
  secondsToTimecode
} from '../../util/timecode-converter';

import style from './WrapperBlock.module.css';

class WrapperBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      speaker: '',
      start: 0,
      timecodeOffset: this.props.blockProps.timecodeOffset
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
      if (this.props.blockProps.handleAnalyticsEvents) {
        this.props.blockProps.handleAnalyticsEvents({
          category: 'WrapperBlock',
          action: 'handleOnClickEdit',
          name: 'newSpeakerName',
          value: newSpeakerName
        });
      }

      // From docs: https://draftjs.org/docs/api-reference-selection-state#keys-and-offsets
      // selection points are tracked as key/offset pairs,
      // where the key value is the key of the ContentBlock where the point is positioned
      // and the offset value is the character offset within the block.

      // Get key of the currentBlock
      const keyForCurrentCurrentBlock = this.props.block.getKey();
      // create empty selection for current block
      // https://draftjs.org/docs/api-reference-selection-state#createempty
      const currentBlockSelection = SelectionState.createEmpty(keyForCurrentCurrentBlock);
      const editorStateWithSelectedCurrentBlock = EditorState.acceptSelection(this.props.blockProps.editorState, currentBlockSelection);

      const currentBlockSelectionState = editorStateWithSelectedCurrentBlock.getSelection();
      const newBlockDataWithSpeakerName = { speaker: newSpeakerName };

      // https://draftjs.org/docs/api-reference-modifier#mergeblockdata
      const newContentState = Modifier.mergeBlockData(
        this.props.contentState,
        currentBlockSelectionState,
        newBlockDataWithSpeakerName
      );

      this.props.blockProps.setEditorNewContentState(newContentState);
    }
  }

  handleTimecodeClick = () => {
    this.props.blockProps.onWordClick(this.state.start);
    if (this.props.blockProps.handleAnalyticsEvents) {
      this.props.blockProps.handleAnalyticsEvents({
        category: 'WrapperBlock',
        action: 'handleTimecodeClick',
        name: 'onWordClick',
        value: secondsToTimecode(this.state.start)
      });
    }

  }

  render() {
    let startTimecode = this.state.start;
    if (this.props.blockProps.timecodeOffset) {
      startTimecode += this.props.blockProps.timecodeOffset;
    }

    const speakerElement = <SpeakerLabel
      name={ this.state.speaker }
      handleOnClickEdit={ this.handleOnClickEdit }
    />;

    const timecodeElement = <span className={ style.time } onClick={ this.handleTimecodeClick }>{shortTimecode(startTimecode)}</span>;

    return (
      <div className={ style.WrapperBlock }>
        <div className={ [ style.markers, style.unselectable ].join(' ') }
          contentEditable={ false }>
          {this.props.blockProps.showSpeakers ? speakerElement : ''}

          {this.props.blockProps.showTimecodes ? timecodeElement : ''}
        </div>
        <div className={ style.text }>
          <EditorBlock { ...this.props } />
        </div>
      </div>
    );
  }
}

export default WrapperBlock;
