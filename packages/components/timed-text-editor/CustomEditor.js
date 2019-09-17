// TODO: move CustomEditor in separate file
import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'draft-js';
import WrapperBlock from './WrapperBlock';

class CustomEditor extends React.Component {

    handleWordClick = (e) => {
      this.props.onWordClick(e);
    }

    renderBlockWithTimecodes = () => {
      return {
        component: WrapperBlock,
        editable: true,
        props: {
          showSpeakers: this.props.showSpeakers,
          showTimecodes: this.props.showTimecodes,
          timecodeOffset: this.props.timecodeOffset,
          editorState: this.props.editorState,
          setEditorNewContentState: this.props.setEditorNewContentState,
          onWordClick: this.handleWordClick,
          handleAnalyticsEvents: this.props.handleAnalyticsEvents
        }
      };
    }

    shouldComponentUpdate(nextProps) {
      // https://stackoverflow.com/questions/39182657/best-performance-method-to-check-if-contentstate-changed-in-draftjs-or-just-edi
      if (nextProps.editorState !== this.props.editorState) {
        return true;
      }

      return false;
    }

    handleOnChange = (e) => {
      this.props.onChange(e);
    }

    render() {
      return (
        <Editor
          editorState={ this.props.editorState }
          onChange={ this.handleOnChange }
          stripPastedStyles
          blockRendererFn={ this.renderBlockWithTimecodes }
          handleKeyCommand={ this.props.handleKeyCommand }
          keyBindingFn={ this.props.customKeyBindingFn }
          spellCheck={ this.props.spellCheck }
        />
      );
    }
}

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

export default CustomEditor;