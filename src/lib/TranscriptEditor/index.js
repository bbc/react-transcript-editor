import React from 'react';
import PropTypes from 'prop-types';

import TimedTextEditor from './TimedTextEditor';
import MediaPlayer from './MediaPlayer';
import Settings from './Settings';
import KeyboardShortcutHelp from './KeyboardShortcutHelp';
import style from './index.module.css';
import styleSettings from './Settings/index.module.css';
import KeyboardShortcutHelpSettings from './KeyboardShortcutHelp/index.module.css';
// import { timecodeToSeconds } from '../Util/timecode-converter/index';

class TranscriptEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: 0,
      lastLocalSavedTime: '',
      transcriptData: null,
      isScrollIntoViewOn: false,
      showSettings: false,
      showKeyboardShortcutsHelp: false,
      isPauseWhileTypingOn: true,
      rollBackValueInSeconds: 15,
      timecodeOffset: 0,
      showTimecodes: true,
      showSpeakers: true
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.transcriptData !== null) {
      return {
        transcriptData: nextProps.transcriptData
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

  handleRollBackValueInSeconds = (e) => {
    const rollBackValue = e.target.value;
    console.log(rollBackValue);
    this.setState({ rollBackValueInSeconds: rollBackValue });
  }

  handleSetTimecodeOffset = (timecodeOffset) => {
    console.log('TranscriptEditor', timecodeOffset );

    this.setState({ timecodeOffset: timecodeOffset },
      () => {
        // eslint-disable-next-line react/no-string-refs
        this.refs.timedTextEditor.forceUpdate();
      });
    // this.refs.MediaPlayer.setTimeCodeOffset('01:00:00:00');
  }

  handleShowTimecodes = (e) => {
    console.log(e);
    const isChecked = e.target.checked;
    this.setState({ showTimecodes: isChecked }, () => {
      // eslint-disable-next-line react/no-string-refs
      // this.refs.timedTextEditor.forceUpdate();
    });
  }

  handleShowSpeakers = (e) => {
    console.log(e);
    const isChecked = e.target.checked;
    this.setState({ showSpeakers: isChecked }, () => {
      // eslint-disable-next-line react/no-string-refs
      // this.refs.timedTextEditor.forceUpdate();
    });
  }

  handleSettingsToggle = () => {
    this.setState(prevState => ({
      showSettings: !prevState.showSettings
    }));
  }

  handleKeyboardShortcutsHelpToggle = () => {
    this.setState(prevState => ({
      showKeyboardShortcutsHelp: !prevState.showKeyboardShortcutsHelp
    }));
  }

  render() {
    const mediaPlayer = <MediaPlayer
      ref={ 'MediaPlayer' }
      // eslint-disable-next-line no-return-assign
      rollBackValueInSeconds={ this.state.rollBackValueInSeconds }
      timecodeOffset={ this.state.timecodeOffset }
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
        timecodeOffset={ this.state.timecodeOffset }
        showTimecodes={ this.state.showTimecodes }
        showSpeakers={ this.state.showSpeakers }
        handlePauseWhileTyping={ this.handlePauseWhileTyping }
        handleIsScrollIntoViewChange={ this.handleIsScrollIntoViewChange }
        handleRollBackValueInSeconds={ this.handleRollBackValueInSeconds }
        handleSetTimecodeOffset={ this.handleSetTimecodeOffset }
        handleShowTimecodes={ this.handleShowTimecodes }
        handleShowSpeakers={ this.handleShowSpeakers }
      />
    </div>;

    const KeyboardShortcutHelpElement = <div className={ KeyboardShortcutHelpSettings.settings }>
      <span  onClick={ this.handleKeyboardShortcutsHelpToggle }>X</span>
      <KeyboardShortcutHelp />
    </div>;

    return (
      <div className={ style.container }>
        <aside className={ style.aside }>
          { this.props.mediaUrl ? mediaPlayer : null }
        </aside>

        <button className={ style.settingsButton } onClick={ this.handleSettingsToggle }> ⚙ </button>
        { this.state.showSettings? settings : null }
        <button className={ style.settingsButton } onClick={ this.handleKeyboardShortcutsHelpToggle }> ℹ </button>
        { this.state.showKeyboardShortcutsHelp? KeyboardShortcutHelpElement : null }

        <main className={ style.main }>
          <TimedTextEditor
            transcriptData={ this.state.transcriptData }
            timecodeOffset={ this.state.timecodeOffset }
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
            showTimecodes={ this.state.showTimecodes }
            showSpeakers={ this.state.showSpeakers }
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
