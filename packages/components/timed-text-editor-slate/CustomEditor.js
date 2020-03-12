import React from "react";
import PropTypes from "prop-types";
import { Editor } from "draft-js";

  
import WrapperBlock from './WrapperBlock';

// NOTE: custom editor is in a separate class to minimise re-renders
// if considering refactoring, removing the separate class, please double check
// that doing so does not introduce uncessary re-renders first.
class CustomEditor extends React.Component {
  handleWordClick = e => {
    this.props.onWordClick(e);
  };

  renderBlockWithTimecodes = () => {
    return {
      component: WrapperBlock,
      editable: true,
      props: {
        showSpeakers: this.props.showSpeakers,
        showTimecodes: this.props.showTimecodes,
        timecodeOffset: this.props.timecodeOffset,
        editorState: this.props.editorState,
        setEditorNewContentStateSpeakersUpdate: this.props.setEditorNewContentStateSpeakersUpdate,
        onWordClick: this.handleWordClick,
        handleAnalyticsEvents: this.props.handleAnalyticsEvents,
        isEditable: this.props.isEditable
      }
    };
  };

  shouldComponentUpdate(nextProps) {
    // https://stackoverflow.com/questions/39182657/best-performance-method-to-check-if-contentstate-changed-in-draftjs-or-just-edi
    if (nextProps.editorState !== this.props.editorState) {
      return true;
    }

    if (nextProps.isEditable !== this.props.isEditable) {
      return true;
    }

    return false;
  }

  handleOnChange = e => {
    this.props.onChange(e);
  };

  render() {
    return (
      <Editor
        editorState={this.props.editorState}
        onChange={this.handleOnChange}
        stripPastedStyles
        blockRendererFn={this.renderBlockWithTimecodes}
        handleKeyCommand={this.props.handleKeyCommand}
        keyBindingFn={this.props.customKeyBindingFn}
        spellCheck={this.props.spellCheck}
      />
    );
  }
}

export default CustomEditor;
