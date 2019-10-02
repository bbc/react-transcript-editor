import React, { useState, useEffect } from 'react';
import { EditorBlock, Modifier, EditorState, SelectionState } from 'draft-js';

import SpeakerLabel from './SpeakerLabel';
import PropTypes from 'prop-types';

import {
  shortTimecode,
  secondsToTimecode
} from '../../util/timecode-converter';

import style from './WrapperBlock.module.css';

const WrapperBlock = (props) => {
  const [ speaker, setSpeaker ] = useState(props.block.getData().get('speaker'));
  const [ startTimecode, setStartTimeCode ] = useState(props.block.getData().get('start'));
  const timecodeOffset = props.blockProps.timecodeOffset;

  if (timecodeOffset) {
    setStartTimeCode(() => startTimecode + timecodeOffset);
  }

  const handleOnClickEdit = () => {
    const newSpeakerName = prompt('New Speaker Name?');

    if (newSpeakerName && newSpeakerName !== '') {
      setSpeaker(newSpeakerName);
      if (props.blockProps.handleAnalyticsEvents) {
        props.blockProps.handleAnalyticsEvents({
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
      const keyForCurrentCurrentBlock = props.block.getKey();
      // create empty selection for current block
      // https://draftjs.org/docs/api-reference-selection-state#createempty
      const currentBlockSelection = SelectionState.createEmpty(
        keyForCurrentCurrentBlock
      );

      const editorStateWithSelectedCurrentBlock = EditorState.acceptSelection(
        this.props.blockProps.editorState,
        currentBlockSelection
      );

      const currentBlockSelectionState = editorStateWithSelectedCurrentBlock.getSelection();
      const newBlockDataWithSpeakerName = { speaker: newSpeakerName };

      // https://draftjs.org/docs/api-reference-modifier#mergeblockdata
      const newContentState = Modifier.mergeBlockData(
        props.contentState,
        currentBlockSelectionState,
        newBlockDataWithSpeakerName
      );

      props.blockProps.setEditorNewContentState(newContentState);
    }
  };

  const handleTimecodeClick = () => {
    props.blockProps.onWordClick(startTimecode);

    if (props.blockProps.handleAnalyticsEvents) {
      props.blockProps.handleAnalyticsEvents({
        category: 'WrapperBlock',
        action: 'handleTimecodeClick',
        name: 'onWordClick',
        value: secondsToTimecode(startTimecode)
      });
    }
  };
  const speakerElement = (
    <SpeakerLabel
      name={ speaker }
      handleOnClickEdit={ handleOnClickEdit }
    />
  );

  const timecodeElement = (
    <span className={ style.time } onClick={ handleTimecodeClick }>
      {shortTimecode(startTimecode)}
    </span>
  );

  return (
    <div className={ style.WrapperBlock }>
      <div
        className={ [ style.markers, style.unselectable ].join(' ') }
        contentEditable={ false }
      >
        {props.blockProps.showSpeakers ? speakerElement : ''}

        {props.blockProps.showTimecodes ? timecodeElement : ''}
      </div>
      <div className={ style.text }>
        <EditorBlock { ...props } />
      </div>
    </div>
  );
};

WrapperBlock.propTypes = {
  block: PropTypes.any,
  blockProps: PropTypes.any,
  contentState: PropTypes.any
};

export default WrapperBlock;