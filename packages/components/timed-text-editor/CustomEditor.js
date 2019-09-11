// TODO: move CustomEditor in separate file
import React from 'react';
import {
  Editor,
} from 'draft-js';
import WrapperBlock from './WrapperBlock';

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

export default React.memo(CustomEditor);