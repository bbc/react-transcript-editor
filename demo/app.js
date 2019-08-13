import React from 'react';
// NOTE: This slows down performance, even during development
// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update');
//   whyDidYouUpdate(React, { exclude: [ /^HotKeysWrapper/ ] } );
// }
import TranscriptEditor from '../packages/components/transcript-editor';
import SttTypeSelect from './select-stt-json-type';
import ExportFormatSelect from './select-export-format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import demoTranscript from './sample-data/KateDarling-bbcKaldiTranscriptWithSpeakerSegments.json';
const demoMediaUrl = 'https://download.ted.com/talks/KateDarling_2018S-950k.mp4';
const demoTitle = 'Ted Talk - Kate Darling';

import style from './index.module.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transcriptData: null,
      mediaUrl: null,
      isTextEditable: true,
      spellCheck: false,
      sttType: 'bbckaldi',
      analyticsEvents: [],
      title: '',
      fileName: ''
    };

    this.transcriptEditorRef = React.createRef();
  }

  loadDemo = () => {
    this.setState({
      transcriptData: demoTranscript,
      mediaUrl: demoMediaUrl,
      title: demoTitle,
      sttType: 'bbckaldi'
    });
  }

  // https://stackoverflow.com/questions/8885701/play-local-hard-drive-video-file-with-html5-video-tag
  handleLoadMedia = (files) => {
    const file = files[0];
    const videoNode = document.createElement('video');
    const canPlay = videoNode.canPlayType(file.type);

    if (canPlay) {
      const fileURL = URL.createObjectURL(file);
      this.setState({
        // transcriptData: demoTranscript,
        mediaUrl: fileURL,
        fileName: file.name
      });
    } else {
      alert('Select a valid audio or video file.');
    }
  }

  handleLoadMediaUrl = () => {
    const fileURL = prompt("Paste the URL you'd like to use here:");

    this.setState({
      // transcriptData: demoTranscript,
      mediaUrl: fileURL
    });
  }

  handleLoadTranscriptJson = (files) => {
    const file = files[0];

    if (file.type === 'application/json') {
      const fileReader = new FileReader();

      fileReader.onload = event => {
        this.setState({
          transcriptData: JSON.parse(event.target.result)
        });
      };

      fileReader.readAsText(file);
    } else {
      alert('Select a valid JSON file.');
    }
  }

  handleIsTextEditable = (e) => {
    this.setState({
      isTextEditable: e.target.checked
    });
  };

  handleSpellCheck = (e) => {
    this.setState({
      spellCheck: e.target.checked
    });
  };

  // https://stackoverflow.com/questions/21733847/react-jsx-selecting-selected-on-selected-select-option
  handleSttTypeChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleExportFormatChange = event => {
    console.log(event.target.name, event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };

  exportTranscript = () => {
    console.log('export');
    // eslint-disable-next-line react/no-string-refs
    const { data, ext } = this.transcriptEditorRef.current.getEditorContent(
      this.state.exportFormat
    );
    let tmpData = data;
    if (ext === 'json') {
      tmpData = JSON.stringify(data, null, 2);
    }
    if (ext !== 'docx') {
      this.download(tmpData, `${ this.state.mediaUrl }.${ ext }`);
    }
  };

  // https://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
  download = (content, filename, contentType) => {
    console.log('download');
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

  clearLocalStorage = () => {
    localStorage.clear();
    console.info('Cleared local storage.');
  };

  handleAnalyticsEvents = event => {
    this.setState({ analyticsEvents: [ ...this.state.analyticsEvents, event ] });
  };

  handleChangeTranscriptTitle = newTitle => {
    this.setState({
      title: newTitle
    });
  };

  handleChangeTranscriptName = value => {
    this.setState({ fileName: value });
  };

  render() {
    return (
      <div className={ style.container }>
        <span>React Transcript Editor Demo </span>
        <a
          href="https://github.com/bbc/react-transcript-editor"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FontAwesomeIcon icon={ faGithub } />
        </a>
        <div className={ style.demoNav }>
          <section className={ style.demoNavItem }>
            <label className={ style.sectionLabel }>Start</label>
            <button className={ style.demoButton } onClick={ () => this.loadDemo() }>Load Demo</button>
          </section>

          <section className={ style.demoNavItem }>
            <label className={ style.sectionLabel }>Custom Media</label>
            <button onClick={ () => this.handleLoadMediaUrl() }>Load from URL</button>
            <input
              type={ 'file' }
              id={ 'mediaFile' }
              onChange={ e => this.handleLoadMedia(e.target.files) }
            />
            <label htmlFor="mediaFile" >Load local media</label>
            {this.state.fileName !== '' ? <label className={ style.fileNameLabel }>{this.state.fileName}</label> : null}
          </section>

          <section className={ style.demoNavItem }>
            <label className={ style.sectionLabel }>Import Transcript</label>
            <SttTypeSelect
              className={ style.dropdown }
              name={ 'sttType' }
              value={ this.state.sttType }
              handleChange={ this.handleSttTypeChange }
            />

            <input
              type={ 'file' }
              id={ 'transcriptFile' }
              onChange={ e => this.handleLoadTranscriptJson(e.target.files) }
            />
            <label htmlFor="transcriptFile" >Load Transcript</label>
            {this.state.transcriptData !== null ? <label className={ style.fileNameLabel }>Transcript loaded.</label> : null}

          </section>

          <section className={ style.demoNavItem }>
            <label className={ style.sectionLabel }>Export Transcript</label>
            <ExportFormatSelect
              className={ style.dropdown }
              name={ 'exportFormat' }
              value={ this.state.exportFormat }
              handleChange={ this.handleExportFormatChange }
            />
            <button onClick={ () => this.exportTranscript() }>Export File</button>
          </section>

          <section className={ style.demoNavItem }>
            <label className={ style.sectionLabel }>
              Transcript Title
              <span className={ style.titleLabel }>(Optional)</span>
            </label>
            <input
              type="text"
              value={ this.state.title }
              onChange={ e => this.handleChangeTranscriptTitle(e.target.value) }
            />
          </section>

          <section className={ style.demoNavItem }>
            <label className={ style.sectionLabel }>Options</label>

            <div className={ style.checkbox }>
              <label className={ style.editableLabel } htmlFor={ 'textIsEditableCheckbox' }>Text Is Editable</label>
              <input
                id={ 'textIsEditableCheckbox' }
                type="checkbox"
                checked={ this.state.isTextEditable }
                onChange={ this.handleIsTextEditable }
              />
            </div>

            <div className={ style.checkbox }>
              <label className={ style.editableLabel } htmlFor={ 'spellCheckCheckbox' }>Spell Check</label>
              <input
                id={ 'spellCheckCheckbox' }
                type="checkbox"
                checked={ this.state.spellCheck }
                onChange={ this.handleSpellCheck }
              />
            </div>

            <button className={ style.warningButton } onClick={ () => this.clearLocalStorage() }>Clear Local Storage</button>
          </section>
        </div>

        <TranscriptEditor
          transcriptData={ this.state.transcriptData }
          fileName={ this.state.fileName }
          mediaUrl={ this.state.mediaUrl }
          isEditable={ this.state.isTextEditable }
          spellCheck={ this.state.spellCheck }
          sttJsonType={ this.state.sttType }
          handleAnalyticsEvents={ this.handleAnalyticsEvents }
          title={ this.state.title }
          ref={ this.transcriptEditorRef }
        />

        <label>Components Analytics</label>
        <textarea
          style={ { height: '200px', width: '100%' } }
          value={ JSON.stringify(this.state.analyticsEvents, null, 2) }
          disabled
        />
      </div>
    );
  }
}

// render(<App />, document.getElementById('root'));

export default App;
