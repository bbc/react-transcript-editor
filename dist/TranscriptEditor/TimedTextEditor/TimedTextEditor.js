import React from 'react';
import { // Draft,
Editor, EditorState, // ContentState,
convertFromRaw } from 'draft-js';
import styles from './TimedTextEditor.module.css';
import bbcKaldiToDraft from './adapters/bbc-kaldi/index.js';

class TimedTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      transcriptData: this.props.transcriptData
    };

    this.onChange = editorState => this.setState({
      editorState
    });
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillReceiveProps(nexProps) {
    this.setState({
      transcriptData: nexProps.transcriptData
    }, () => {
      this.loadData();
    });
  }

  loadData() {
    if (this.props.transcriptData !== "") {
      let blocks = bbcKaldiToDraft(this.props.transcriptData);
      const entityMap = {};
      const contentState = convertFromRaw({
        blocks,
        entityMap
      });
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState
      });
    }
  }

  render() {
    return React.createElement("section", {
      className: styles.editor
    }, React.createElement(Editor, {
      editorState: this.state.editorState,
      onChange: this.onChange
    }));
  }

}

export default TimedTextEditor;