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
        };
    
        this.onChange = editorState => this.setState({ editorState });
    }
    
    loadData() {
        const blocks = [
        {
            text: 'Lorem ipsum',
            type: 'paragraph',
            data: {
            speaker: 'Foo',
            },
            entityRanges: [],
        },
        {
            text: 'Dolor foo bar',
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
        <div >
         <div className={styles.test}>Yo</div>
            <Editor editorState={this.state.editorState} onChange={this.onChange} />
            <button onClick={() => this.loadData()}>load data</button>
        </div>
        );
    }
}

export default TimedTextEditor;