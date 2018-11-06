import React from 'react';
import styles from './TranscriptEditor.module.css';
import TimedTextEditor from './TimedTextEditor/TimedTextEditor';
import MediaController from './MediaController/MediaController';
import MediaPreview from './MediaPreview/MediaPreview';

class TranscriptEditor extends React.Component {
  render() {
    return React.createElement('section', {
      className: styles.container
    }, React.createElement('header', {
      className: styles.header
    }, React.createElement(MediaController, {
      mediaUrl: this.props.mediaUrl
    })), React.createElement('nav', {
      className: styles.nav
    }, React.createElement(MediaPreview, {
      mediaUrl: this.props.mediaUrl
    })), React.createElement('main', {
      className: styles.main
    }, React.createElement(TimedTextEditor, {
      transcriptData: this.props.transcriptData
    })), React.createElement('aside', {
      className: styles.aside
    }, 'Settings'), React.createElement('footer', {
      className: styles.footer
    }, 'Footer'));
  }

}

export default TranscriptEditor;