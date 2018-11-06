import React from 'react';
import styles from './index.module.css';

import TimedTextEditor from './TimedTextEditor/index.js';
import ProgressBar from './ProgressBar/index.js';
import MediaPlayer from './MediaPlayer/index.js';

class TranscriptEditor extends React.Component {
  render() {
    return (
        <section className={ styles.container }>
            <header className={ styles.header }>
                <ProgressBar mediaUrl={ this.props.mediaUrl }  />
            </header>
            <nav className={ styles.nav }>
                <MediaPlayer mediaUrl={ this.props.mediaUrl } />
            </nav>
            <main className={ styles.main }>
                <TimedTextEditor transcriptData={ this.props.transcriptData } />
            </main>
            <aside className={ styles.aside }>Settings</aside>
            <footer className={ styles.footer }>Footer</footer>
        </section>
    );
  }
}

export default TranscriptEditor;
