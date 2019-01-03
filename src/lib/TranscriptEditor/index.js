import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faKeyboard } from '@fortawesome/free-solid-svg-icons';

import TimedTextEditor from './TimedTextEditor';
import MediaPlayer from './MediaPlayer';
import Settings from './Settings';
import Shortcuts from './Settings/Shortcuts';
import { secondsToTimecode } from '../Util/timecode-converter/index';

import style from './index.module.css';

class TranscriptEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: 0,
      lastLocalSavedTime: '',
      transcriptData: null,
      isScrollIntoViewOn: false,
      showSettings: false,
      showShortcuts: false,
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
    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({ 
        category: 'TranscriptEditor', 
        action: 'doubleClickOnWord', 
        name: 'startTime', 
        value: secondsToTimecode(startTime)
      });
    }

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

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({ 
        category: 'TranscriptEditor', 
        action: 'handleIsScrollIntoViewChange', 
        name: 'isScrollIntoViewOn', 
        value: isChecked
      });
    }

  }
  handlePauseWhileTyping = (e) => {
    const isChecked = e.target.checked;
    this.setState({ isPauseWhileTypingOn: isChecked });

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({ 
        category: 'TranscriptEditor', 
        action: 'handlePauseWhileTyping', 
        name: 'isPauseWhileTypingOn', 
        value: isChecked
      });
    }
  }

  handleRollBackValueInSeconds = (e) => {
    const rollBackValue = e.target.value;
    this.setState({ rollBackValueInSeconds: rollBackValue });

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({ 
        category: 'TranscriptEditor', 
        action: 'handleRollBackValueInSeconds', 
        name: 'rollBackValueInSeconds', 
        value: rollBackValue
      });
    }
  }

  handleSetTimecodeOffset = (timecodeOffset) => {

    this.setState({ timecodeOffset: timecodeOffset },
      () => {
        // eslint-disable-next-line react/no-string-refs
        this.refs.timedTextEditor.forceUpdate();
      });
  }

  handleShowTimecodes = (e) => {
    const isChecked = e.target.checked;
    this.setState({ showTimecodes: isChecked });

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({ 
        category: 'TranscriptEditor', 
        action: 'handleShowTimecodes', 
        name: 'showTimecodes', 
        value: isChecked
      });
    }
  }

  handleShowSpeakers = (e) => {
    const isChecked = e.target.checked;
    this.setState({ showSpeakers: isChecked });

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({ 
        category: 'TranscriptEditor', 
        action: 'handleShowSpeakers', 
        name: 'showSpeakers', 
        value:  isChecked
      });
    }
  }

  handleSettingsToggle = () => {
    this.setState(prevState => ({
      showSettings: !prevState.showSettings
    }));
    
    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({ 
        category: 'TranscriptEditor', 
        action: 'handleSettingsToggle', 
        name: 'showSettings', 
        value:  !this.state.showSettings
      });
    }
  }

  handleShortcutsToggle = () => {
    this.setState(prevState => ({
      showShortcuts: !prevState.showShortcuts
    }));

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({ 
        category: 'TranscriptEditor', 
        action: 'handleShortcutsToggle', 
        name: 'showShortcuts', 
        value:  !this.state.showShortcuts
      });
    }
  }

  getEditorContent = (exportFormat) => {
    return this.refs.timedTextEditor.getEditorContent(exportFormat);
  }
  
  render() {
    const mediaPlayer = <MediaPlayer
      hookSeek={ foo => this.setCurrentTime = foo }
      hookPlayMedia={ foo => this.playMedia = foo }
      hookIsPlaying={ foo => this.isPlaying = foo }
      rollBackValueInSeconds={ this.state.rollBackValueInSeconds }
      timecodeOffset={ this.state.timecodeOffset }
      hookOnTimeUpdate={ this.handleTimeUpdate }
      mediaUrl={ this.props.mediaUrl }
      // ref={ 'MediaPlayer' }
      handleAnalyticsEvents={ this.props.handleAnalyticsEvents }
    />;

    const settings = <Settings
      handleSettingsToggle={ this.handleSettingsToggle }
      defaultValuePauseWhileTyping={ this.state.isPauseWhileTypingOn }
      defaultValueScrollSync={ this.state.isScrollIntoViewOn }
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
      handleAnalyticsEvents={ this.props.handleAnalyticsEvents }
    />;

    const shortcuts = <Shortcuts
      handleShortcutsToggle={ this.handleShortcutsToggle }
    />;

    return (
      <div className={ style.container }>
        <header className={ style.header }>
          { this.state.showSettings ? settings : null }
          { this.state.showShortcuts ? shortcuts : null }
        </header>

        <aside className={ style.aside }>{ this.props.mediaUrl ? mediaPlayer : null }</aside>

        <div className={ style.settingsContainer }>
          <button className={ style.settingsButton } onClick={ this.handleSettingsToggle }>
            <FontAwesomeIcon icon={ faCog } />
          </button>
          <button className={ style.settingsButton } onClick={ this.handleShortcutsToggle }>
            <FontAwesomeIcon icon={ faKeyboard } />
          </button>
        </div>

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
            mediaUrl={ this.props.mediaUrl }
            isScrollIntoViewOn={ this.state.isScrollIntoViewOn }
            isPauseWhileTypingOn={ this.state.isPauseWhileTypingOn }
            showTimecodes={ this.state.showTimecodes }
            showSpeakers={ this.state.showSpeakers }
            ref={ 'timedTextEditor' }
            handleAnalyticsEvents={ this.props.handleAnalyticsEvents }
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
  handleAnalyticsEvents: PropTypes.func
};

export default TranscriptEditor;
