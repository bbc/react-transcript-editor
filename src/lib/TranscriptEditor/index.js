import React from 'react';
import styles from './index.module.css';

import TimedTextEditor from './TimedTextEditor/index.js';
import ProgressBar from './ProgressBar/index.js';
import MediaPlayer from './MediaPlayer/index.js';

class TranscriptEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            currentTime: 0
        }
        // this.handleWorClick = handleWorClick.
        this.handleWordClick = this.handleWordClick.bind(this);
    }

    // eslint-disable-next-line class-methods-use-this
    handleWordClick(startTime){
        console.log('2.TranscriptEditor - handleWorClick ',startTime);
        this.setState({
            currentTime: startTime
        })
    }

    render() {
        return (
            <section className={ styles.container }>
                <header className={ styles.header }>
                    <ProgressBar 
                    mediaUrl={ this.props.mediaUrl }  
                    />
                </header>
                <nav className={ styles.nav }>
                    <MediaPlayer 
                    seekToCurrentTime={ this.state.currentTime } 
                    mediaUrl={ this.props.mediaUrl } 
                    />
                </nav>
                <main className={ styles.main }>
                    <TimedTextEditor 
                    transcriptData={ this.props.transcriptData } 
                    onWordClick={ this.handleWordClick }
                    />
                </main>
                {/* <aside className={ styles.aside }>Settings</aside> */}
                <footer className={ styles.footer }></footer>
            </section>
        );
    }
}

export default TranscriptEditor;
