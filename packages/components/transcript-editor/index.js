import React, { useState, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import TimedTextEditor from '../timed-text-editor';
import MediaPlayer from '../media-player';
import VideoPlayer from '../video-player';
import Settings from '../settings';
import Shortcuts from '../keyboard-shortcuts';
import { secondsToTimecode } from '../../util/timecode-converter';
import Header from './src/Header.js';
import ExportOptions from './src/ExportOptions.js';
import style from './index.module.css';

// TODO: move to another file with tooltip - rename HowDoesThisWork or HelpMessage
import HowDoesThisWork from './src/HowDoesThisWork.js';

const exportOptionsList = [
  { value: 'txt', label: 'Text file' },
  { value: 'txtspeakertimecodes', label: 'Text file - with Speakers and Timecodes' },
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

// handleSettingsToggle={ handleSettingsToggle }
// defaultValuePauseWhileTyping={ isPauseWhileTyping }
// defaultValueScrollSync={ isScrollIntoView }
// defaultRollBackValueInSeconds={ rollBackValueInSeconds }
// timecodeOffset={ timecodeOffset }
// showTimecodes={ showTimecodes }
// showSpeakers={ showSpeakers }
// handlePauseWhileTyping={ handlePauseWhileTyping }
// handleIsScrollIntoViewChange={ handleIsScrollIntoViewChange }
// handleRollBackValueInSeconds={ handleRollBackValueInSeconds }
// handleSetTimecodeOffset={ handleSetTimecodeOffset }
// handleShowTimecodes={ handleShowTimecodes }
// handleShowSpeakers={ handleShowSpeakers }
// handleAnalyticsEvents={ props.handleAnalyticsEvents }
// previewIsDisplayed={ previewIsDisplayed }
// handlePreviewIsDisplayed={ handlePreviewIsDisplayed }

const TranscriptEditor = (props) => {
  const videoRef = useRef();
  const timedTextEditorRef = useRef();

  const [ currentTime, setCurrentTime ] = useState(0);
  const [ timecodeOffset, setTimecodeOffset ] = useState(0);

  // configuration
  const [ isScrollIntoView, setIsScrollIntoView ] = useState(false);
  const [ showSettings, setShowSettings ] = useState(false);
  const [ showShortcuts, setShowShortcuts ] = useState(false);
  const [ showExportOptions, setShowExportOptions ] = useState(false);
  const [ isPauseWhileTyping, setIsPauseWhileTyping ] = useState(true);
  const [ rollBackValueInSeconds, setRollBackValueInSeconds ] = useState(15);
  const [ showTimecodes, setShowTimecodes ] = useState(true);
  const [ showSpeakers, setShowSpeakers ] = useState(true);
  const [ previewIsDisplayed, setPreviewIsDisplayed ] = useState(true);

  const [ mediaUrl, setMediaUrl ] = useState('');
  const [ mediaName, setMediaName ] = useState('');
  const [ fileName, setFileName ] = useState('');

  const [ isInLocalStorage, setIsInLocalStorage ] = useState(false);

  const [ isPlaying, setIsPlaying ] = useState(false);

  const [ mediaDuration, setMediaDuration ] = useState('00:00:00:00');
  const [ pauseTimer, setPauseTimer ] = useState(null);

  const localFileName = `draftJs-${ mediaName }`;

  const TYPE_PAUSE_INTERVAL_MS = 3000;

  const handleSaveTranscript = () => {
    alert('The changes to this transcript have been saved in your browser');

    timedTextEditorRef.current.updateTimestampsForEditorState();

    return timedTextEditorRef.current.localSave(props.mediaUrl);
  };

  const playMedia = () => {
    setIsPlaying(true);
    videoRef.current.play();

    if (props.handleAnalyticsEvents) {
      props.handleAnalyticsEvents({
        category: 'MediaPlayer',
        action: 'playMedia',
        name: 'playMedia',
        value: secondsToTimecode(videoRef.current.currentTime)
      });
    }
  };

  const mediaControls = (
    <MediaPlayer
      title={ props.title ? props.title : '' }
      mediaDuration={ mediaDuration }
      currentTime={ currentTime }

      hookSeek={ mediaPlayer => setCurrentTime(mediaPlayer.currentTime) }
      hookPlayMedia={ () => playMedia }
      hookIsPlaying={ () => isPlaying }

      rollBackValueInSeconds={ rollBackValueInSeconds }
      timecodeOffset={ timecodeOffset }
      mediaUrl={ props.mediaUrl }
      handleAnalyticsEvents={ props.handleAnalyticsEvents }
      videoRef={ videoRef }
      handleSaveTranscript={ handleSaveTranscript }
    />
  );

  // currently  not playing
  const handlePlayMedia = play => {
    console.log('handlePlayMedia');
    playMedia(play);
    setIsPlaying(play);
    console.log(isPlaying);
  };

  const resetPauseTimer = (ms) => {
    if (pauseTimer) {
      clearTimeout(pauseTimer);
    }
    setPauseTimer(setTimeout(() => handlePlayMedia(true), ms));
  };

  const saveLocally = (editorState) => {
    console.log('Saved file');
    localStorage.setItem(localFileName, editorState);
    setIsInLocalStorage(true);
  };

  const handleSave = (editorState) => {
    if (props.handleSave) {
      return props.handleSave(editorState);
    } else {
      saveLocally(editorState);
    }
  };

  const handleEdit = () => {
    if (isPauseWhileTyping && isPlaying) {
      handlePlayMedia(false);
      resetPauseTimer(TYPE_PAUSE_INTERVAL_MS);
    }
  };

  useLayoutEffect(() => {
    if (mediaUrl === '' && props.mediaUrl) {
      setMediaUrl(props.mediaUrl);
    }

    if (fileName === '' && props.fileName) {
      setFileName(props.fileName);
    }

    if (mediaName === '' && (props.mediaUrl || props.mediaName)) {
      setMediaName(mediaUrl.includes('blob') ? fileName : mediaUrl);
    }

    const loadSaveData = () => {
      const saveName = localFileName;
      const data = localStorage.getItem(saveName);
      if (data) {
        timedTextEditorRef.current.setEditorState(data);
      } else {
        console.log('No locally saved data');
      }
    };

    if (!isInLocalStorage || (timedTextEditorRef && timedTextEditorRef.current)) {
      loadSaveData();
      setIsInLocalStorage(true);
    }

    return () => {
    };
  }, [ fileName, isInLocalStorage, localFileName, mediaName, mediaUrl, props.fileName, props.mediaName, props.mediaUrl ]);

  const handleWordClick = startTime => {
    console.log('handleword');
    videoRef.current.currentTime = startTime;
    setCurrentTime(startTime);
    handlePlayMedia(true);

    if (props.handleAnalyticsEvents) {
      props.handleAnalyticsEvents({
        category: 'TranscriptEditor',
        action: 'doubleClickOnWord',
        name: 'startTime',
        value: secondsToTimecode(startTime)
      });
    }
  };

  const handleTimeUpdate = e => {
    setCurrentTime(e.target.currentTime);
  };

  const handleIsScrollIntoViewChange = e => {
    const isChecked = e.target.checked;
    setIsScrollIntoView(isChecked);

    if (props.handleAnalyticsEvents) {
      props.handleAnalyticsEvents({
        category: 'TranscriptEditor',
        action: 'handleIsScrollIntoViewChange',
        name: 'isScrollIntoView',
        value: isChecked
      });
    }
  };

  const handlePauseWhileTyping = e => {
    const isChecked = e.target.checked;
    setIsPauseWhileTyping(isChecked);

    if (props.handleAnalyticsEvents) {
      props.handleAnalyticsEvents({
        category: 'TranscriptEditor',
        action: 'handlePauseWhileTyping',
        name: 'isPauseWhileTyping',
        value: isChecked
      });
    }
  };

  const handleRollBackValueInSeconds = e => {
    const rollBackValue = e.target.value;
    setRollBackValueInSeconds(rollBackValue);

    if (props.handleAnalyticsEvents) {
      props.handleAnalyticsEvents({
        category: 'TranscriptEditor',
        action: 'handleRollBackValueInSeconds',
        name: 'rollBackValueInSeconds',
        value: rollBackValue
      });
    }
  };

  const handleSetTimecodeOffset = offset => {
    setTimecodeOffset(offset);
  };

  const handleShowTimecodes = e => {
    const isChecked = e.target.checked;
    setShowTimecodes(isChecked);

    if (props.handleAnalyticsEvents) {
      props.handleAnalyticsEvents({
        category: 'TranscriptEditor',
        action: 'handleShowTimecodes',
        name: 'showTimecodes',
        value: isChecked
      });
    }
  };

  const handleShowSpeakers = e => {
    const isChecked = e.target.checked;
    setShowSpeakers(isChecked);

    if (props.handleAnalyticsEvents) {
      props.handleAnalyticsEvents({
        category: 'TranscriptEditor',
        action: 'handleShowSpeakers',
        name: 'showSpeakers',
        value: isChecked
      });
    }
  };

  const handleSettingsToggle = (prevState) => {
    setShowSettings(!prevState.showSettings);
    if (props.handleAnalyticsEvents) {
      props.handleAnalyticsEvents({
        category: 'TranscriptEditor',
        action: 'handleSettingsToggle',
        name: 'showSettings',
        value: !showSettings
      });
    }
  };

  const handleShortcutsToggle = (prevState) => {
    setShowShortcuts(!prevState.showShortcuts);
    if (props.handleAnalyticsEvents) {
      props.handleAnalyticsEvents({
        category: 'TranscriptEditor',
        action: 'handleShortcutsToggle',
        name: 'showShortcuts',
        value: !showShortcuts
      });
    }
  };

  const handleExportToggle = (prevState) => {
    console.log('handleExportToggle', showExportOptions);
    setShowExportOptions(!prevState.showExportOptions);
    if (props.handleAnalyticsEvents) {
      props.handleAnalyticsEvents({
        category: 'TranscriptEditor',
        action: 'handleExportToggle',
        name: 'showExportOptions',
        value: !showExportOptions
      });
    }
  };

  // https://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
  const download = (content, filename, contentType) => {
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

  const getEditorContent = exportFormat => {
    const title = props.title ? props.title : '' ;

    return timedTextEditorRef.current.getEditorContent(exportFormat, title);
  };

  const handleExportOptionsChange = (e) => {
    const exportFormat = e.target.value;

    if (exportFormat !== 'instructions') {
      const fileName = props.title ? props.title : mediaUrl;
      const { data, ext } = getEditorContent(exportFormat);
      let tmpData = data;
      if (ext === 'json') {
        tmpData = JSON.stringify(data, null, 2);
      }
      if (ext !== 'docx') {
        download(tmpData, `${ fileName }.${ ext }`);
      }

      if (props.handleAnalyticsEvents) {
        props.handleAnalyticsEvents({
          category: 'TranscriptEditor',
          action: 'handleExportOptionsChange',
          name: 'exportFile',
          value: exportFormat
        });
      }
    }
  };

  const handlePreviewIsDisplayed = () => {
    setPreviewIsDisplayed(!previewIsDisplayed);
  };

  const onLoadedDataGetDuration = e => {
    const currentDuration = e.target.duration;
    const currentDurationWithOffset = currentDuration + timecodeOffset;
    const durationInSeconds = secondsToTimecode(currentDurationWithOffset);

    setMediaDuration(durationInSeconds);

    if (props.handleAnalyticsEvents) {
      props.handleAnalyticsEvents({
        category: 'TranscriptEditor',
        action: 'onLoadedDataGetDuration',
        name: 'durationInSeconds-WithoutOffset',
        value: secondsToTimecode(currentDuration)
      });
    }
  };

  const videoPlayer = (
    <VideoPlayer
      mediaUrl={ mediaUrl }
      onTimeUpdate={ handleTimeUpdate }
      videoRef={ videoRef }
      previewIsDisplayed={ previewIsDisplayed }
      onLoadedDataGetDuration={ onLoadedDataGetDuration }
    />
  );

  const settings = (
    <Settings
      handleSettingsToggle={ handleSettingsToggle }
      defaultValuePauseWhileTyping={ isPauseWhileTyping }
      defaultValueScrollSync={ isScrollIntoView }
      defaultRollBackValueInSeconds={ rollBackValueInSeconds }
      timecodeOffset={ timecodeOffset }
      showTimecodes={ showTimecodes }
      showSpeakers={ showSpeakers }
      handlePauseWhileTyping={ handlePauseWhileTyping }
      handleIsScrollIntoViewChange={ handleIsScrollIntoViewChange }
      handleRollBackValueInSeconds={ handleRollBackValueInSeconds }
      handleSetTimecodeOffset={ handleSetTimecodeOffset }
      handleShowTimecodes={ handleShowTimecodes }
      handleShowSpeakers={ handleShowSpeakers }
      handleAnalyticsEvents={ props.handleAnalyticsEvents }
      previewIsDisplayed={ previewIsDisplayed }
      handlePreviewIsDisplayed={ handlePreviewIsDisplayed }
    />
  );

  const exportOptions = (
    <ExportOptions
      exportOptionsList={ exportOptionsList }
      handleExportOptionsChange={ handleExportOptionsChange }
      handleExportToggle={ handleExportToggle }
    />);

  const shortcuts = (
    <Shortcuts handleShortcutsToggle={ handleShortcutsToggle } />
  );

  const timedTextEditor = (
    <TimedTextEditor
      fileName={ props.fileName }
      transcriptData={ props.transcriptData }
      timecodeOffset={ timecodeOffset }
      handleWordClick={ handleWordClick }
      handleSave={ () => handleSave }
      handleEdit={ () => handleEdit }
      currentTime={ currentTime }
      isEditable={ props.isEditable }
      spellCheck={ props.spellCheck }
      sttJsonType={ props.sttJsonType }
      mediaUrl={ mediaUrl }
      isScrollIntoView={ isScrollIntoView }
      showTimecodes={ showTimecodes }
      showSpeakers={ showSpeakers }
      ref={ timedTextEditorRef }
      handleAnalyticsEvents={ props.handleAnalyticsEvents }
    />
  );

  const header = (
    <Header
      showSettings={ showSettings }
      showShortcuts={ showShortcuts }
      showExportOptions={ showExportOptions }
      settings={ settings }
      shortcuts={ shortcuts }
      exportOptions={ exportOptions }
      tooltip={ HowDoesThisWork }
      mediaUrl={ mediaUrl }
      mediaControls={ videoRef.current ? mediaControls : null }
      handleSettingsToggle={ handleSettingsToggle }
      handleShortcutsToggle={ handleShortcutsToggle }
      handleExportToggle={ handleExportToggle }
    />
  );

  return (
    <div className={ style.container }>
      {mediaUrl ? header : null}

      <div className={ style.grid }>
        <section className={ style.row }>
          <aside className={ style.aside }>
            {mediaUrl ? videoPlayer : null}
          </aside>

          <main className={ style.main }>
            {mediaUrl && props.transcriptData ? timedTextEditor : null}
          </main>
        </section>
      </div>
    </div>
  );
};

TranscriptEditor.propTypes = {
  fileName: PropTypes.string,
  handleAnalyticsEvents: PropTypes.func,
  handleSave: PropTypes.func,
  isEditable: PropTypes.bool,
  mediaUrl: PropTypes.string,
  onClick: PropTypes.func,
  spellCheck: PropTypes.bool,
  sttJsonType: PropTypes.string,
  title: PropTypes.string,
  transcriptData: PropTypes.object
};

export default TranscriptEditor;
