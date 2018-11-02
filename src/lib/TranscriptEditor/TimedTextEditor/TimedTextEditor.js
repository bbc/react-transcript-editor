import React from 'react';
import 
// Draft,
    {
    Editor,
    EditorState,
    // ContentState,
    convertFromRaw,
  } from 'draft-js';

import styles from './TimedTextEditor.module.css';


class TimedTextEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            transcriptData: this.props.transcriptData
        };
    
        this.onChange = editorState => this.setState({ editorState });
    }
    
    loadData() {
        const blocks = [
        {
            text: 'Hello',
            type: 'paragraph',
            data: {
            speaker: 'Foo',
            },
            entityRanges: [],
        },
        {
            text: 'World',
            type: 'paragraph',
            data: {
            speaker: 'Bar',
            },
            entityRanges: [],
        },
        ];
    
        const entityMap = {};
    
        const contentState = convertFromRaw({ blocks, entityMap });
        const editorState = EditorState.createWithContent(contentState);
    
        this.setState({ editorState });
    }
    
    render() {
        return (
        <section>
      
            <Editor editorState={this.state.editorState} onChange={this.onChange} />
            <button onClick={() => this.loadData()}>load data</button>
        </section>
        );
    }
}

export default TimedTextEditor;
