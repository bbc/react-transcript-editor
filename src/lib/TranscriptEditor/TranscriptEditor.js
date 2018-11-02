import React from 'react';
import styles from  "./TranscriptEditor.module.css";

import TimedTextEditor from "./TimedTextEditor/TimedTextEditor";
import MediaController from "./MediaController/MediaController";
import MediaPreview from "./MediaPreview/MediaPreview";

class TranscriptEditor extends React.Component {

    render() {
        return (
            <section className={styles.container}>
                <header className={styles.header}>
                    <MediaController 
                    mediaUrl={this.props.mediaUrl} 
                    />
                </header>
                <nav  className={styles.nav}>
                    <MediaPreview 
                    mediaUrl={this.props.mediaUrl}            
                    />
                </nav>
                <main  className={styles.main}>
                    <TimedTextEditor
                    transcriptData={this.props.transcriptData}
                    />
                </main>
                <aside className={styles.aside}>Settings</aside>
                <footer className={styles.footer}>Footer</footer>
        </section>
        );
    }
}

export default TranscriptEditor;