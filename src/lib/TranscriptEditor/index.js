import React from 'react';
import PropTypes from 'prop-types';

import TimedTextEditor from './TimedTextEditor';
import MediaPlayer from './MediaPlayer';

import styles from './index.module.css';

class TranscriptEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: 0,
      lastLocalSavedTime: '',
      transcriptData: null,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.transcriptData !== null) {
      return {
        transcriptData: nextProps.transcriptData,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.transcriptData !== this.state.transcriptData) {
      //   this.loadData();
      if (this.refs.timedTextEditor.isPresentInLocalStorage(this.props.mediaUrl)) {
        console.log('was already present in local storage');
        this.refs.timedTextEditor.loadLocalSavedData(this.props.mediaUrl);
      } else {
        console.log('not present in local storage');
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  handleWordClick = (startTime) => {
    this.setCurrentTime(startTime);
  }

  // eslint-disable-next-line class-methods-use-this
  handleTimeUpdate = (currentTime) => {
    this.setState({
      currentTime,
    })
  }

  getEditorContent = sttType => this.refs.timedTextEditor.getEditorContent(sttType)

  render() {
    return (
      <section>
        <section className={ styles.container }>
          <aside className={ styles.aside }>
            <MediaPlayer
              // eslint-disable-next-line no-return-assign
              hookSeek={ foo => this.setCurrentTime = foo }
              hookOnTimeUpdate={ this.handleTimeUpdate }
              mediaUrl={ this.props.mediaUrl }
              />
          </aside>
          <main className={ styles.main }>
            <TimedTextEditor
              transcriptData={ this.state.transcriptData }
              onWordClick={ this.handleWordClick }
              currentTime={ this.state.currentTime }
              isEditable={ this.props.isEditable }
              sttJsonType={ this.props.sttJsonType }
              ref={ 'timedTextEditor' }
              mediaUrl={ this.props.mediaUrl }
              />
          </main>
        </section>
      </section>
    );
  }
}

TranscriptEditor.propTypes = {
  mediaUrl: PropTypes.string,
  isEditable: PropTypes.bool,
  sttJsonType: PropTypes.string,
};

export default TranscriptEditor;
