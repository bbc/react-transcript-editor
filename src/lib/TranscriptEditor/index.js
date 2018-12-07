import React from 'react';
import PropTypes from 'prop-types';

import TimedTextEditor from './TimedTextEditor';
import MediaPlayer from './MediaPlayer';

import styles from './index.module.css';
import { throws } from 'assert';

class TranscriptEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: 0,
      lastLocalSavedTime: '',
      transcriptData: null,
      isScrollIntoViewOn: false
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

  handlePlayMedia = (bool) => {
    this.playMedia(bool)
  }

  handleIsPlaying = () => {
    return this.isPlaying()
  }

  handleIsScrollIntoViewChange = (isChecked) => {
    this.setState({ isScrollIntoViewOn: isChecked })
  }

  getEditorContent = sttType => this.refs.timedTextEditor.getEditorContent(sttType)

  exportData = (exportFormat) => this.refs.timedTextEditor.exportData(exportFormat)

  render() {
    return (
      <section>
        <section className={ styles.container }>
          <aside className={ styles.aside }>
            <MediaPlayer
              // eslint-disable-next-line no-return-assign
              hookSeek={ foo => this.setCurrentTime = foo }
              hookPlayMedia={ foo => this.playMedia = foo }
              hookIsPlaying={ foo => this.isPlaying = foo }
              hookOnTimeUpdate={ this.handleTimeUpdate }
              mediaUrl={ this.props.mediaUrl }
              isScrollIntoViewOn={ this.state.isScrollIntoViewOn }
              handleIsScrollIntoViewChange={ this.handleIsScrollIntoViewChange }
             />
          </aside>
          <main className={ styles.main }>
            <TimedTextEditor
              transcriptData={ this.state.transcriptData }
              onWordClick={ this.handleWordClick }
              playMedia={ this.handlePlayMedia }
              isPlaying={ this.handleIsPlaying }
              isScrollIntoViewOn={ this.state.isScrollIntoViewOn }
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
