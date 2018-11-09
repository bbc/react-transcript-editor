import React from 'react';
import styles from './index.module.css';

import TimedTextEditor from './TimedTextEditor/index.js';
import MediaPlayer from './MediaPlayer/index.js';

class TranscriptEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
           currentTime:0
        }
    }

    // eslint-disable-next-line class-methods-use-this
    handleWordClick = (startTime) => {
        this.setCurrentTime(startTime);
    }

    // eslint-disable-next-line class-methods-use-this
    handleTimeUpdate = (currentTime) => {
            this.setState({
                currentTime: currentTime
            })
    }

    render() {
        return (
            <section className={ styles.container }>
                <header className={ styles.header }>
                  
                </header>
                <aside className={ styles.nav }>
                    <MediaPlayer 
                    // eslint-disable-next-line no-return-assign
                    hookSeek={ (foo) => this.setCurrentTime = foo }
                    hookOnTimeUpdate={ this.handleTimeUpdate }
                    mediaUrl={ this.props.mediaUrl } 
                    />
                </aside>
                <main className={ styles.main }>
                    <TimedTextEditor 
                    transcriptData={ this.props.transcriptData } 
                    onWordClick={ this.handleWordClick }
                    currentTime={ this.state.currentTime } 
                    />
                </main>
                {/* <aside className={ styles.aside }>Settings</aside> */}
                <footer className={ styles.footer }></footer>
            </section>
        );
    }
}

export default TranscriptEditor;
