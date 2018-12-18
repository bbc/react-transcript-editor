import React from 'react';
import PropTypes from 'prop-types';

import TimedTextEditor from './TimedTextEditor';
import MediaPlayer from './MediaPlayer';
import Settings from './Settings';

import style from './index.module.css';
import styleSettings from './Settings/index.module.css';

class TranscriptEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: 0,
      lastLocalSavedTime: '',
      transcriptData: null,
      isScrollIntoViewOn: false,
      showSettings: false,
      isPauseWhileTypingOn: true,
      rollBackValueInSeconds: 16
    };
  }

  static getDerivedStateFromProps(nextProps) {
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
    });
  }

  handlePlayMedia = (bool) => {
    this.playMedia(bool);
  }

  handleIsPlaying = () => {
    return this.isPlaying();
  }

  handleIsScrollIntoViewChange = (e) => {
    const isChecked = e.target.checked;
    this.setState({ isScrollIntoViewOn: isChecked });
  }
  handlePauseWhileTyping = (e) => {
    const isChecked = e.target.checked;
    this.setState({ isPauseWhileTypingOn: isChecked });
  }

  handleRollBackValueInSeconds =(e) => {
    const rollBackValue = e.target.value;
    this.setState({ rollBackValueInSeconds: rollBackValue });
  }

  getEditorContent = (exportFormat) => {
    // eslint-disable-next-line react/no-string-refs
    return this.refs.timedTextEditor.getEditorContent(exportFormat);
  }

  handleSettingsToggle = () => {
    this.setState(prevState => ({
      showSettings: !prevState.showSettings
    }));
  }

  render() {
    const mediaPlayer = <MediaPlayer
    // eslint-disable-next-line no-return-assign
      rollBackValueInSeconds={ this.state.rollBackValueInSeconds }
      hookSeek={ foo => this.setCurrentTime = foo }
      hookPlayMedia={ foo => this.playMedia = foo }
      hookIsPlaying={ foo => this.isPlaying = foo }
      hookOnTimeUpdate={ this.handleTimeUpdate }
      mediaUrl={ this.props.mediaUrl }
    />;
    const settings = <div className={ styleSettings.settings }>
      <span  onClick={ this.handleSettingsToggle }>X</span>
      <Settings 
        defaultValuePauseWhileTyping={ this.state.isPauseWhileTypingOn }
        defaultvalueScrollSync={ this.state.isScrollIntoViewOn }
        defaultRollBackValueInSeconds={ this.state.rollBackValueInSeconds }
        handlePauseWhileTyping={ this.handlePauseWhileTyping }
        handleIsScrollIntoViewChange={ this.handleIsScrollIntoViewChange }
        handleRollBackValueInSeconds={ this.handleRollBackValueInSeconds }
      /> 
    </div>;
    
    return (
      <div className={ style.container }>
        <aside className={ style.aside }>
          { this.props.mediaUrl ? mediaPlayer : null }
        </aside>

        <button className={ style.settingsButton } onClick={ this.handleSettingsToggle }> ⚙ </button>
        { this.state.showSettings? settings : null }

        <main className={ style.main }>
          <TimedTextEditor
            transcriptData={ this.state.transcriptData }
            onWordClick={ this.handleWordClick }
            playMedia={ this.handlePlayMedia }
            isPlaying={ this.handleIsPlaying }
            currentTime={ this.state.currentTime }
            isEditable={ this.props.isEditable }
            sttJsonType={ this.props.sttJsonType }
            ref={ 'timedTextEditor' }
            mediaUrl={ this.props.mediaUrl }
            isScrollIntoViewOn={ this.state.isScrollIntoViewOn }
            isPauseWhileTypingOn={ this.state.isPauseWhileTypingOn }
          />
        </main>
      </div>
    );
  }
}

TranscriptEditor.propTypes = {
  mediaUrl: PropTypes.string,
  isEditable: PropTypes.bool,
  sttJsonType: PropTypes.string,
};

export default TranscriptEditor;
