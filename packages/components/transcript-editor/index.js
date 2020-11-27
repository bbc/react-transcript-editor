import React from 'react';
import PropTypes from 'prop-types';
import TimedTextEditor from '../timed-text-editor';
import MediaPlayer from '../media-player';
import VideoPlayer from '../video-player';
import Settings from '../settings';
import Shortcuts from '../keyboard-shortcuts';
import { secondsToTimecode } from '../../util/timecode-converter';
import Header from './src/Header.js';
import ExportOptions from './src/ExportOptions';

// TODO: move to another file with tooltip - rename HowDoesThisWork or HelpMessage
import HowDoesThisWork from './src/HowDoesThisWork';

import style from './index.module.css';

const exportOptionsList = [
  { value: 'txt', label: 'Text file' },
  {
    value: 'txtspeakertimecodes',
    label: 'Text file - with Speakers and Timecodes'
  },
  { value: 'docx', label: 'MS Word' },
  { value: 'srt', label: 'Srt - Captions' },
  { value: 'ttml', label: 'TTML - Captions' },
  { value: 'premiereTTML', label: 'TTML for Adobe Premiere - Captions' },
  { value: 'itt', label: 'iTT - Captions' },
  { value: 'csv', label: 'CSV - Captions' },
  { value: 'vtt', label: 'VTT - Captions' },
  { value: 'pre-segment-txt', label: 'Pre segmented txt - Captions' },
  { value: 'json-captions', label: 'Json - Captions' },
  { value: 'draftjs', label: 'Draft Js - json' },
  { value: 'digitalpaperedit', label: 'Digital Paper Edit - Json' }
];

class TranscriptEditor extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();

    this.state = {
      currentTime: 0,
      transcriptData: null,
      isScrollIntoViewOn: false,
      showSettings: false,
      showShortcuts: false,
      showExportOptions: false,
      isPauseWhileTypingOn: true,
      rollBackValueInSeconds: 15,
      timecodeOffset: 0,
      showTimecodes: true,
      showSpeakers: true,
      previewIsDisplayed: true,
      mediaDuration: '00:00:00:00',
      gridDisplay: null,
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

  // performance optimization
  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.mediaUrl !== this.props.mediaUrl) {
      return true;
    }

    return nextState !== this.state;
  };

  componentDidMount = () => {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  };

  updateDimensions = () => {
    let gridDisplay = {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      gridColumnGap: '1em'
    };

    let displayMedia = null;

    // if the mediaUrl is for an audio file, then extend TimedTextEditor to be full width
    if (this.props.mediaType === 'audio') {
      console.log('this.props.mediaType', this.props.mediaType);
      gridDisplay = null;
      displayMedia = { display: 'none' };
    }

    // Handeling mobile view
    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    if (width <= 767) {
      gridDisplay = null;
    }

    this.setState({
      gridDisplay,
      displayMedia
    });
  };

  // eslint-disable-next-line class-methods-use-this
  handleWordClick = startTime => {
    if (this.props.handleAnalyticsEvents) {
      this.props.handleAnalyticsEvents({
        category: 'TranscriptEditor',
        action: 'doubleClickOnWord',
        name: 'startTime',
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

  handlePlayMedia = isPlaying => {
    this.playMedia(isPlaying);
  };

  handleIsPlaying = () => {
    return this.isPlaying();
  };

  handleIsScrollIntoViewChange = e => {
    const isChecked = e.target.checked;
    this.setState({ isScrollIntoViewOn: isChecked });

    if (this.props.handleAnalyticsEvents) {
      this.props.handleAnalyticsEvents({
        category: 'TranscriptEditor',
        action: 'handleIsScrollIntoViewChange',
        name: 'isScrollIntoViewOn',
        value: isChecked
      });
    }
  };
  handlePauseWhileTyping = e => {
    const isChecked = e.target.checked;
    this.setState({ isPauseWhileTypingOn: isChecked });

    if (this.props.handleAnalyticsEvents) {
      this.props.handleAnalyticsEvents({
        category: 'TranscriptEditor',
        action: 'handlePauseWhileTyping',
        name: 'isPauseWhileTypingOn',
        value: isChecked
      });
    }
  };

  handleRollBackValueInSeconds = e => {
    const rollBackValue = e.target.value;
    this.setState({ rollBackValueInSeconds: rollBackValue });

    if (this.props.handleAnalyticsEvents) {
      this.props.handleAnalyticsEvents({
        category: 'TranscriptEditor',
        action: 'handleRollBackValueInSeconds',
        name: 'rollBackValueInSeconds',
        value: rollBackValue
      });
    }
  };

  handleSetTimecodeOffset = timecodeOffset => {
    this.setState({ timecodeOffset: timecodeOffset }, () => {
      this.timedTextEditorRef.current.forceUpdate();
    });
  };

  handleShowTimecodes = e => {
    const isChecked = e.target.checked;
    this.setState({ showTimecodes: isChecked });

    if (this.props.handleAnalyticsEvents) {
      this.props.handleAnalyticsEvents({
        category: 'TranscriptEditor',
        action: 'handleShowTimecodes',
        name: 'showTimecodes',
        value: isChecked
      });
    }
  };

  handleShowSpeakers = e => {
    const isChecked = e.target.checked;
    this.setState({ showSpeakers: isChecked });

    if (this.props.handleAnalyticsEvents) {
      this.props.handleAnalyticsEvents({
        category: 'TranscriptEditor',
        action: 'handleShowSpeakers',
        name: 'showSpeakers',
        value: isChecked
      });
    }
  };

  handleSettingsToggle = () => {
    this.setState(
      prevState => ({
        showSettings: !prevState.showSettings
      }),
      () => {
        if (this.props.handleAnalyticsEvents) {
          this.props.handleAnalyticsEvents({
            category: 'TranscriptEditor',
            action: 'handleSettingsToggle',
            name: 'showSettings',
            value: !this.state.showSettings
          });
        }
      }
    );
  };

  handleShortcutsToggle = () => {
    this.setState(
      prevState => ({
        showShortcuts: !prevState.showShortcuts
      }),
      () => {
        if (this.props.handleAnalyticsEvents) {
          this.props.handleAnalyticsEvents({
            category: 'TranscriptEditor',
            action: 'handleShortcutsToggle',
            name: 'showShortcuts',
            value: !this.state.showShortcuts
          });
        }
      }
    );
  };

  handleExportToggle = () => {
    console.log('handleExportToggle', this.state.showExportOptions);
    this.setState(
      prevState => ({
        showExportOptions: !prevState.showExportOptions
      }),
      () => {
        if (this.props.handleAnalyticsEvents) {
          this.props.handleAnalyticsEvents({
            category: 'TranscriptEditor',
            action: 'handleExportToggle',
            name: 'showExportOptions',
            value: !this.state.showExportOptions
          });
        }
      }
    );
  };

  handleExportOptionsChange = e => {
    const exportFormat = e.target.value;
    console.log(exportFormat);
    if (exportFormat !== 'instructions') {
      const fileName = this.props.title
        ? this.props.title
        : this.props.mediaUrl;

      const { data, ext } = this.getEditorContent(exportFormat);
      let tmpData = data;
      if (ext === 'json') {
        tmpData = JSON.stringify(data, null, 2);
      }
      if (ext !== 'docx') {
        this.download(tmpData, `${ fileName }.${ ext }`);
      }

      if (this.props.handleAnalyticsEvents) {
        this.props.handleAnalyticsEvents({
          category: 'TranscriptEditor',
          action: 'handleExportOptionsChange',
          name: 'exportFile',
          value: exportFormat
        });
      }
    }
  };

  // https://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
  download = (content, filename, contentType) => {
    const type = contentType || 'application/octet-stream';
    const link = document.createElement('a');
    const blob = new Blob([ content ], { type: type });

    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    // Firefox fix - cannot do link.click() if it's not attached to DOM in firefox
    // https://stackoverflow.com/questions/32225904/programmatical-click-on-a-tag-not-working-in-firefox
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  getEditorContent = exportFormat => {
    const title = this.props.title ? this.props.title : '';

    return this.timedTextEditorRef.current.getEditorContent(
      exportFormat,
      title
    );
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
    const durationInSeconds = secondsToTimecode(currentDurationWithOffset);

    this.setState({
      mediaDuration: durationInSeconds
    });

    if (this.props.handleAnalyticsEvents) {
      this.props.handleAnalyticsEvents({
        category: 'TranscriptEditor',
        action: 'onLoadedDataGetDuration',
        name: 'durationInSeconds-WithoutOffset',
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

  handleAutoSaveChanges = data => {
    // making `TranscriptEditor` - `handleAutoSaveChanges` optional
    if (this.props.handleAutoSaveChanges) {
      this.props.handleAutoSaveChanges(data);
    }
  };

  render() {
    const videoPlayer = (
      <VideoPlayer
        mediaUrl={ this.props.mediaUrl }
        onTimeUpdate={ this.handleTimeUpdate }
        videoRef={ this.videoRef }
        previewIsDisplayed={ this.state.previewIsDisplayed }
        onLoadedDataGetDuration={ this.onLoadedDataGetDuration }
      />
    );

    const mediaControls = (
      <MediaPlayer
        title={ this.props.title ? this.props.title : '' }
        mediaDuration={ this.state.mediaDuration }
        currentTime={ this.state.currentTime }
        hookSeek={ foo => (this.setCurrentTime = foo) }
        hookPlayMedia={ foo => (this.playMedia = foo) }
        hookIsPlaying={ foo => (this.isPlaying = foo) }
        rollBackValueInSeconds={ this.state.rollBackValueInSeconds }
        timecodeOffset={ this.state.timecodeOffset }
        mediaUrl={ this.props.mediaUrl }
        handleAnalyticsEvents={ this.props.handleAnalyticsEvents }
        videoRef={ this.videoRef }
      />
    );

    const settings = (
      <Settings
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
        previewIsDisplayed={ this.state.previewIsDisplayed }
        handlePreviewIsDisplayed={ this.handlePreviewIsDisplayed }
        handleChangePreviewViewWidth={ this.handleChangePreviewViewWidth }
      />
    );

    const exportOptions = (
      <ExportOptions
        exportOptionsList={ exportOptionsList }
        handleExportOptionsChange={ this.handleExportOptionsChange }
        handleExportToggle={ this.handleExportToggle }
      />
    );

    const shortcuts = (
      <Shortcuts handleShortcutsToggle={ this.handleShortcutsToggle } />
    );

    // export format for `handleAutoSaveChanges` is assigned with `autoSaveContentType`
    // but if that's not specified  it looks at  `sttJsonType`
    // if that's not specified either, it falls back on `draftjs`.
    let contentFormat = 'draftjs';
    if (this.props.autoSaveContentType) {
      contentFormat = this.props.autoSaveContentType;
    } else if (this.props.sttJsonType) {
      contentFormat = this.props.sttJsonType;
    }

    const timedTextEditor = (
      <TimedTextEditor
        fileName={ this.props.fileName }
        transcriptData={ this.state.transcriptData }
        timecodeOffset={ this.state.timecodeOffset }
        onWordClick={ this.handleWordClick }
        playMedia={ this.handlePlayMedia }
        isPlaying={ this.handleIsPlaying }
        currentTime={ this.state.currentTime }
        isEditable={ this.props.isEditable }
        spellCheck={ this.props.spellCheck }
        sttJsonType={ this.props.sttJsonType }
        mediaUrl={ this.props.mediaUrl }
        isScrollIntoViewOn={ this.state.isScrollIntoViewOn }
        isPauseWhileTypingOn={ this.state.isPauseWhileTypingOn }
        showTimecodes={ this.state.showTimecodes }
        showSpeakers={ this.state.showSpeakers }
        ref={ this.timedTextEditorRef }
        handleAnalyticsEvents={ this.props.handleAnalyticsEvents }
        handleAutoSaveChanges={ this.handleAutoSaveChanges }
        autoSaveContentType={ contentFormat }
        title={ this.props.title ? this.props.title : Date.now().toString() }
      />
    );

    const header = (
      <Header
        showSettings={ this.state.showSettings }
        showShortcuts={ this.state.showShortcuts }
        showExportOptions={ this.state.showExportOptions }
        settings={ settings }
        shortcuts={ shortcuts }
        exportOptions={ exportOptions }
        tooltip={ HowDoesThisWork }
        mediaUrl={ this.props.mediaUrl }
        mediaControls={ this.videoRef.current ? mediaControls : null }
        handleSettingsToggle={ this.handleSettingsToggle }
        handleShortcutsToggle={ this.handleShortcutsToggle }
        handleExportToggle={ this.handleExportToggle }
      />
    );

    return (
      <div className={ style.container }>
        {this.props.mediaUrl ? header : null}

        <div className={ style.grid }>
          <section className={ style.row } style={ this.state.gridDisplay }>
            <aside className={ style.aside } style={ this.state.displayMedia }>
              {this.props.mediaUrl ? videoPlayer : null}
            </aside>

            <main
              className={
                this.props.mediaType === 'audio'
                  ? style.mainWithAudiio
                  : style.main
              }
            >
              {this.props.mediaUrl && this.props.transcriptData
                ? timedTextEditor
                : null}
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
  spellCheck: PropTypes.bool,
  sttJsonType: PropTypes.string,
  handleAnalyticsEvents: PropTypes.func,
  fileName: PropTypes.string,
  transcriptData: PropTypes.object,
  mediaType: PropTypes.string
};

export default TranscriptEditor;
