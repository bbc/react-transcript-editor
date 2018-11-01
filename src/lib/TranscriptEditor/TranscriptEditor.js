import React from 'react';
import "./TranscriptEditor.css";

import TimedTextEditor from "./TimedTextEditor/TimedTextEditor";
import MediaController from "./MediaController/MediaController";

class TranscriptEditor extends React.Component {

    render() {
        return (
            <div>
                <h1>TranscriptEditor</h1>
                <MediaController />
                <TimedTextEditor transcriptData={this.props.transcriptData} />
            </div>
        );
    }
}

export default TranscriptEditor;