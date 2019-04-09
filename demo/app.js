import React from 'react';

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

  handleIsTextEditable = () => {
    this.setState(prevState => ({
      isTextEditable: prevState.isTextEditable !== true
    }));
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
    // eslint-disable-next-line react/no-string-refs
    const { data, ext } = this.transcriptEditorRef.current.getEditorContent(
      this.state.exportFormat
    );
    this.download(data, `${ this.state.mediaUrl }.${ ext }`);
  };

  // https://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
  download = (content, filename, contentType) => {
    const type = contentType || 'application/octet-stream';
    const link = document.createElement('a');
    const blob = new Blob([ content ], { type: type });

    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
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
        Demo <mark>React Transcript Editor</mark> | {' '}
        <a
          href="https://github.com/bbc/react-transcript-editor"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FontAwesomeIcon icon={ faGithub } />
        </a>
        <hr />

        <div className={ style.demoNav }>
          <section className={ style.demoNavItem }>
            <button onClick={ () => this.loadDemo() }>Load demo</button>
          </section>
          <section className={ style.demoNavItem }>
            <label>Load Local Media</label>
            <br />
            <input
              className={ style.demoInput }
              type={ 'file' }
              onChange={ e => this.handleLoadMedia(e.target.files) }
            />
            <br />
            or
            <br />
            <button onClick={ () => this.handleLoadMediaUrl() }>
              Load Media From Url
            </button>
          </section>
          <section className={ style.demoNavItem }>
            <label>
              Open Transcript <code>Json</code>
            </label>
            <br />
            <SttTypeSelect
              name={ 'sttType' }
              value={ this.state.sttType }
              handleChange={ this.handleSttTypeChange }
            />
            <br />
            <input
              className={ style.demoInput }
              type={ 'file' }
              onChange={ e =>
                this.handleLoadTranscriptJson(e.target.files)
              }
            />
          </section>
          <section className={ style.demoNavItem }>
            <label>Export transcript</label>
            <br />
            <ExportFormatSelect
              name={ 'exportFormat' }
              value={ this.state.exportFormat }
              handleChange={ this.handleExportFormatChange }
            />
            <br />
            <button onClick={ () => this.exportTranscript() }>Export file</button>
          </section>
          <section className={ style.demoNavItem }>
            <label>Text Is Editable</label>
            <br />
            <label>
              <input
                type="checkbox"
                defaultChecked="true"
                onChange={ this.handleIsTextEditable }
              />
            </label>
          </section>
          <section className={ style.demoNavItem }>
            <label>
              Transcript Title <i>Optional</i>
            </label>
            <br />
            <input
              className={ style.demoInput }
              type="text"
              value={ this.state.title }
              onChange={ e => this.handleChangeTranscriptTitle(e.target.value) }
            />
          </section>
          <section className={ style.demoNavItem }>
            <button onClick={ () => this.clearLocalStorage() }>
              Clear Local Storage
            </button>
          </section>
        </div>
        <hr />

        <TranscriptEditor
          transcriptData={ this.state.transcriptData }
          fileName={ this.state.fileName }
          mediaUrl={ this.state.mediaUrl }
          isEditable={ this.state.isTextEditable }
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
