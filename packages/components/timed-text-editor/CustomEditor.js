// TODO: move CustomEditor in separate file
import React from 'react';
import {
  Editor,
} from 'draft-js';
import WrapperBlock from './WrapperBlock';
import PropTypes from 'prop-types';

const CustomEditor = (props) => {

  const handleWordClick = e => {
    props.onWordClick(e);
  };

  const renderBlockWithTimecodes = () => {
    return {
      component: WrapperBlock,
      editable: true,
      props: {
        showSpeakers: props.showSpeakers,
        showTimecodes: props.showTimecodes,
        timecodeOffset: props.timecodeOffset,
        editorState: props.editorState,
        setEditorNewContentState: props.setEditorNewContentState,
        onWordClick: handleWordClick,
        handleAnalyticsEvents: props.handleAnalyticsEvents
      }
    };
  };

  const handleOnChange = e => {
    props.onChange(e);
  };

  return (
    <Editor
      editorState={ props.editorState }
      onChange={ handleOnChange }
      stripPastedStyles
      blockRendererFn={ renderBlockWithTimecodes }
      handleKeyCommand={ props.handleKeyCommand }
      keyBindingFn={ props.customKeyBindingFn }
      spellCheck={ props.spellCheck }
    />
  );
};

CustomEditor.propTypes = {
  customKeyBindingFn: PropTypes.any,
  editorState: PropTypes.any,
  handleAnalyticsEvents: PropTypes.any,
  handleKeyCommand: PropTypes.any,
  onChange: PropTypes.any,
  onWordClick: PropTypes.any,
  setEditorNewContentState: PropTypes.any,
  showSpeakers: PropTypes.any,
  showTimecodes: PropTypes.any,
  spellCheck: PropTypes.any,
  timecodeOffset: PropTypes.any
};

export default React.memo(CustomEditor);