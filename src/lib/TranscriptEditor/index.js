import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faKeyboard, faQuestionCircle, faMousePointer, faICursor, faUserEdit, faSave  } from '@fortawesome/free-solid-svg-icons';

import Tooltip from 'react-simple-tooltip';

import TimedTextEditor from './TimedTextEditor';
import MediaPlayer from './MediaPlayer';
import Settings from './Settings';
import Shortcuts from './Settings/Shortcuts';

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
  }

  handleShowTimecodes = (e) => {
    const isChecked = e.target.checked;

    this.setState({ showTimecodes: isChecked });
  }

  handleShowSpeakers = (e) => {
    const isChecked = e.target.checked;

    this.setState({ showSpeakers: isChecked });
  }

  handleSettingsToggle = () => {
    this.setState(prevState => ({
      showSettings: !prevState.showSettings
    }));
  }

  handleShortcutsToggle = () => {
    this.setState(prevState => ({
      showShortcuts: !prevState.showShortcuts
    }));
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
      ref={ 'MediaPlayer' }
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
    />;

    const shortcuts = <Shortcuts
      handleShortcutsToggle={ this.handleShortcutsToggle }
    />;

    const helpMessage = <div className={ style.helpMessage }>
      <span><FontAwesomeIcon className={ style.icon } icon={ faMousePointer } />Double click on a word or timestamp to jump to that point in the video.</span>
      <span><FontAwesomeIcon className={ style.icon } icon={ faICursor } />Start typing to edit text.</span>
      <span><FontAwesomeIcon className={ style.icon } icon={ faUserEdit } />You can add and change names of speakers in your transcript.</span>
      <span><FontAwesomeIcon className={ style.icon } icon={ faKeyboard } />Use keyboard shortcuts for quick control.</span>
      <span><FontAwesomeIcon className={ style.icon } icon={ faSave } />Save & export to get a copy to your desktop.</span>
    </div>;

    const tooltip = <Tooltip
      className={ style.help }
      content={ helpMessage }
      fadeDuration={ 250 }
      fadeEasing={ 'ease-in' }
      placement={ 'bottom' }
      radius={ 5 }
      border={ '#ffffff' }
      background={ '#f2f2f2' }
      color={ '#000000' }
    >
      <FontAwesomeIcon className={ style.icon } icon={ faQuestionCircle } />
    How does this work?
    </Tooltip>;

    return (
      <div className={ style.container }>
        <header className={ style.header }>
          { this.state.showSettings ? settings : null }
          { this.state.showShortcuts ? shortcuts : null }
          {tooltip}
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
