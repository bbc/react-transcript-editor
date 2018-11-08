import React from 'react';
import styles from './index.module.css';

import TimedTextEditor from './TimedTextEditor/index.js';
import ProgressBar from './ProgressBar/index.js';
import MediaPlayer from './MediaPlayer/index.js';

class TranscriptEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
           
        }
    }

    // eslint-disable-next-line class-methods-use-this
    handleWordClick = (startTime) => {
        console.log('2.TranscriptEditor - handleWorClick ',startTime);
        this.setCurrentTime(startTime);
        // this.setState({
        //     currentTime: startTime
        // })
    }

    // eslint-disable-next-line class-methods-use-this
    handleTimeUpdate = (currentTime) => {
        console.log('TranscriptEditor: ',currentTime);
            // this.setState({
            //     currentTimeForText: currentTime
            // })
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
                    hookSeek={ (foo) => this.setCurrentTime = foo }
                    // seekToCurrentTime={ this.state.currentTime } 
                    onTimeUpdate={ t => this.handleTimeUpdate(t)  }
                    mediaUrl={ this.props.mediaUrl } 
                    />
                </nav>
                <main className={ styles.main }>
                    <TimedTextEditor 
                    transcriptData={ this.props.transcriptData } 
                    onWordClick={ this.handleWordClick }
                    currentTimeForText={ this.state.currentTimeForText } 
                    />
                </main>
                {/* <aside className={ styles.aside }>Settings</aside> */}
                <footer className={ styles.footer }></footer>
            </section>
        );
    }
}

export default TranscriptEditor;
