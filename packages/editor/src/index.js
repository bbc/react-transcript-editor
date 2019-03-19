import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "react-simple-tooltip";
import TimedTextEditor from "@bbc-transcript-editor/timed-text-editor";
import MediaPlayer from "@bbc-transcript-editor/media-player";
import VideoPlayer from "@bbc-transcript-editor/video-player";
import Settings from "@bbc-transcript-editor/settings";
import Shortcuts from "@bbc-transcript-editor/keyboard-shortcuts";
import { secondsToTimecode } from "@bbc-transcript-editor/util-timecode-converter";

import "@bbc-transcript-editor/icons";

import style from "./index.module.css";

class TranscriptEditor extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();

    this.state = {
      currentTime: 0,
      lastLocalSavedTime: "",
      transcriptData: null,
      isScrollIntoViewOn: false,
      showSettings: false,
      showShortcuts: false,
      isPauseWhileTypingOn: true,
      rollBackValueInSeconds: 15,
      timecodeOffset: 0,
      showTimecodes: true,
      showSpeakers: true,
      previewIsDisplayed: true,
      mediaDuration: "00:00:00:00"
    };
    this.timedTextEditorRef = React.createRef();
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
    // Transcript and media passed to component at same time
    if (
      prevState.transcriptData !== this.state.transcriptData &&
      prevProps.mediaUrl !== this.props.mediaUrl
    ) {
      console.info("Transcript and media");
      this.ifPresentRetrieveTranscriptFromLocalStorage();
    }
    // Transcript first and then media passed to component
    else if (
      prevState.transcriptData === this.state.transcriptData &&
      prevProps.mediaUrl !== this.props.mediaUrl
    ) {
      console.info("Transcript first and then media");
      this.ifPresentRetrieveTranscriptFromLocalStorage();
    }
    // Media first and then transcript passed to component
    else if (
      prevState.transcriptData !== this.state.transcriptData &&
      prevProps.mediaUrl === this.props.mediaUrl
    ) {
      console.info("Media first and then transcript");
      this.ifPresentRetrieveTranscriptFromLocalStorage();
    }
  }

  ifPresentRetrieveTranscriptFromLocalStorage = () => {
    if (this.timedTextEditorRef.current !== undefined) {
      if (
        this.timedTextEditorRef.current.isPresentInLocalStorage(
          this.props.mediaUrl
        )
      ) {
        console.info("was already present in local storage");
        this.timedTextEditorRef.current.loadLocalSavedData(this.props.mediaUrl);
      } else {
        console.info("not present in local storage");
      }
    }
  };

  // eslint-disable-next-line class-methods-use-this
  handleWordClick = startTime => {
    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: "TranscriptEditor",
        action: "doubleClickOnWord",
        name: "startTime",
        value: secondsToTimecode(startTime)
      });
    }

    this.setCurrentTime(startTime);
  };

  // eslint-disable-next-line class-methods-use-this
  handleTimeUpdate = e => {
    const currentTime = e.target.currentTime;
    this.setState({
      currentTime
    });
  };

  handlePlayMedia = bool => {
    this.playMedia(bool);
  };

  handleIsPlaying = () => {
    return this.isPlaying();
  };

  handleIsScrollIntoViewChange = e => {
    const isChecked = e.target.checked;
    this.setState({ isScrollIntoViewOn: isChecked });

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: "TranscriptEditor",
        action: "handleIsScrollIntoViewChange",
        name: "isScrollIntoViewOn",
        value: isChecked
      });
    }
  };
  handlePauseWhileTyping = e => {
    const isChecked = e.target.checked;
    this.setState({ isPauseWhileTypingOn: isChecked });

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: "TranscriptEditor",
        action: "handlePauseWhileTyping",
        name: "isPauseWhileTypingOn",
        value: isChecked
      });
    }
  };

  handleRollBackValueInSeconds = e => {
    const rollBackValue = e.target.value;
    this.setState({ rollBackValueInSeconds: rollBackValue });

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: "TranscriptEditor",
        action: "handleRollBackValueInSeconds",
        name: "rollBackValueInSeconds",
        value: rollBackValue
      });
    }
  };

  handleSetTimecodeOffset = timecodeOffset => {
    this.setState({ timecodeOffset: timecodeOffset }, () => {
      // eslint-disable-next-line react/no-string-refs
      this.timedTextEditorRef.current.forceUpdate();
    });
  };

  handleShowTimecodes = e => {
    const isChecked = e.target.checked;
    this.setState({ showTimecodes: isChecked });

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: "TranscriptEditor",
        action: "handleShowTimecodes",
        name: "showTimecodes",
        value: isChecked
      });
    }
  };

  handleShowSpeakers = e => {
    const isChecked = e.target.checked;
    this.setState({ showSpeakers: isChecked });

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: "TranscriptEditor",
        action: "handleShowSpeakers",
        name: "showSpeakers",
        value: isChecked
      });
    }
  };

  handleSettingsToggle = () => {
    this.setState(prevState => ({
      showSettings: !prevState.showSettings
    }));

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: "TranscriptEditor",
        action: "handleSettingsToggle",
        name: "showSettings",
        value: !this.state.showSettings
      });
    }
  };

  handleShortcutsToggle = () => {
    this.setState(prevState => ({
      showShortcuts: !prevState.showShortcuts
    }));

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: "TranscriptEditor",
        action: "handleShortcutsToggle",
        name: "showShortcuts",
        value: !this.state.showShortcuts
      });
    }
  };

  getEditorContent = exportFormat => {
    return this.timedTextEditorRef.current.getEditorContent(exportFormat);
  };

  handlePreviewIsDisplayed = () => {
    this.setState({
      previewIsDisplayed: !this.state.previewIsDisplayed
    });
  };

  onLoadedDataGetDuration = e => {
    const currentDuration = e.target.duration;
    const currentDurationWithOffset =
      currentDuration + this.state.timecodeOffset;
    const durationInSeconds = secondsToTimecode(
      currentDuration + currentDurationWithOffset
    );

    this.setState({
      mediaDuration: durationInSeconds
    });

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: "TranscriptEditor",
        action: "onLoadedDataGetDuration",
        name: "durationInSeconds-WithoutOffset",
        value: secondsToTimecode(currentDuration)
      });
    }
  };

  handleChangePreviewViewWidth = e => {
    const newPreviewViewWidth = e.target.value;
    this.setState({
      previewViewWidth: newPreviewViewWidth
    });
  };

  handleSaveTranscript = () => {
    alert("The changes to this transcript have been saved in your browser");

    return this.timedTextEditorRef.current.localSave(this.props.mediaUrl);
  };

  render() {
    const videoPlayer = (
      <VideoPlayer
        mediaUrl={this.props.mediaUrl}
        onTimeUpdate={this.handleTimeUpdate}
        onClick={this.props.onClick}
        videoRef={this.videoRef}
        previewIsDisplayed={this.state.previewIsDisplayed}
        onLoadedDataGetDuration={this.onLoadedDataGetDuration}
        // viewWith={ this.state.previewViewWidth }
      />
    );

    const mediaControls = (
      <MediaPlayer
        title={this.props.title ? this.props.title : ""}
        mediaDuration={this.state.mediaDuration}
        hookSeek={foo => (this.setCurrentTime = foo)}
        hookPlayMedia={foo => (this.playMedia = foo)}
        hookIsPlaying={foo => (this.isPlaying = foo)}
        rollBackValueInSeconds={this.state.rollBackValueInSeconds}
        timecodeOffset={this.state.timecodeOffset}
        // hookOnTimeUpdate={ this.handleTimeUpdate }
        mediaUrl={this.props.mediaUrl}
        // ref={ 'MediaPlayer' }
        handleAnalyticsEvents={this.props.handleAnalyticsEvents}
        videoRef={this.videoRef}
        handleSaveTranscript={this.handleSaveTranscript}
      />
    );

    const settings = (
      <div className={style.settingsPanelContainer}>
        <Settings
          handleSettingsToggle={this.handleSettingsToggle}
          defaultValuePauseWhileTyping={this.state.isPauseWhileTypingOn}
          defaultValueScrollSync={this.state.isScrollIntoViewOn}
          defaultRollBackValueInSeconds={this.state.rollBackValueInSeconds}
          timecodeOffset={this.state.timecodeOffset}
          showTimecodes={this.state.showTimecodes}
          showSpeakers={this.state.showSpeakers}
          handlePauseWhileTyping={this.handlePauseWhileTyping}
          handleIsScrollIntoViewChange={this.handleIsScrollIntoViewChange}
          handleRollBackValueInSeconds={this.handleRollBackValueInSeconds}
          handleSetTimecodeOffset={this.handleSetTimecodeOffset}
          handleShowTimecodes={this.handleShowTimecodes}
          handleShowSpeakers={this.handleShowSpeakers}
          handleAnalyticsEvents={this.props.handleAnalyticsEvents}
          previewIsDisplayed={this.state.previewIsDisplayed}
          handlePreviewIsDisplayed={this.handlePreviewIsDisplayed}
          // previewViewWidth={ this.state.previewViewWidth }
          handleChangePreviewViewWidth={this.handleChangePreviewViewWidth}
        />
      </div>
    );

    const shortcuts = (
      <div className={style.shortcutsContainer}>
        <Shortcuts handleShortcutsToggle={this.handleShortcutsToggle} />
      </div>
    );

    const timedTextEditor = (
      <TimedTextEditor
        fileName={this.props.fileName}
        transcriptData={this.state.transcriptData}
        timecodeOffset={this.state.timecodeOffset}
        onWordClick={this.handleWordClick}
        playMedia={this.handlePlayMedia}
        isPlaying={this.handleIsPlaying}
        currentTime={this.state.currentTime}
        isEditable={this.props.isEditable}
        sttJsonType={this.props.sttJsonType}
        mediaUrl={this.props.mediaUrl}
        isScrollIntoViewOn={this.state.isScrollIntoViewOn}
        isPauseWhileTypingOn={this.state.isPauseWhileTypingOn}
        showTimecodes={this.state.showTimecodes}
        showSpeakers={this.state.showSpeakers}
        ref={this.timedTextEditorRef}
        handleAnalyticsEvents={this.props.handleAnalyticsEvents}
      />
    );

    const helpMessage = (
      <div className={style.helpMessage}>
        <span>
          <FontAwesomeIcon className={style.icon} icon="mouse-pointer" />
          Double click on a word or timestamp to jump to that point in the
          video.
        </span>
        <span>
          <FontAwesomeIcon className={style.icon} icon="i-cursor" />
          Start typing to edit text.
        </span>
        <span>
          <FontAwesomeIcon className={style.icon} icon="user-edit" />
          You can add and change names of speakers in your transcript.
        </span>
        <span>
          <FontAwesomeIcon className={style.icon} icon="keyboard" />
          Use keyboard shortcuts for quick control.
        </span>
        <span>
          <FontAwesomeIcon className={style.icon} icon="save" />
          Save & export to get a copy to your desktop.
        </span>
      </div>
    );

    const tooltip = (
      <Tooltip
        className={style.help}
        content={helpMessage}
        fadeDuration={250}
        fadeEasing={"ease-in"}
        placement={"bottom"}
        radius={5}
        border={"#ffffff"}
        background={"#f2f2f2"}
        color={"#000000"}
      >
        <FontAwesomeIcon className={style.icon} icon="question-circle" />
        How does this work?
      </Tooltip>
    );

    return (
      <div className={style.container}>
        <header className={style.header}>
          {this.state.showSettings ? settings : null}
          {this.state.showShortcuts ? shortcuts : null}
          {tooltip}
        </header>

        <nav className={style.nav}>
          {this.props.mediaUrl === null ? null : mediaControls}
        </nav>

        <div className={style.settingsContainer}>
          <button
            className={style.settingsButton}
            title="Settings"
            onClick={this.handleSettingsToggle}
          >
            <FontAwesomeIcon icon="cog" />
          </button>
          <button
            className={`${style.settingsButton} ${
              style.keyboardShortcutsButon
            }`}
            title="view shortcuts"
            onClick={this.handleShortcutsToggle}
          >
            <FontAwesomeIcon icon="keyboard" />
          </button>
        </div>

        <div className={style.grid}>
          <section className={style.row}>
            <aside className={style.aside}>
              {this.props.mediaUrl === null ? null : videoPlayer}
            </aside>
            <main className={style.main}>
              {this.props.mediaUrl === null ? null : timedTextEditor}
            </main>
          </section>
        </div>
      </div>
    );
  }
}

TranscriptEditor.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
  mediaUrl: PropTypes.string,
  isEditable: PropTypes.bool,
  sttJsonType: PropTypes.string,
  handleAnalyticsEvents: PropTypes.func,
  fileName: PropTypes.string,
  transcriptData: PropTypes.object
};

export default TranscriptEditor;
