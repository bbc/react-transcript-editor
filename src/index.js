import React from 'react';
import { render } from 'react-dom';

import { TranscriptEditor } from './lib';

import kaldiTedTalkTranscript from './sample-data/KateDarling_2018S-bbc-kaldi.json';
import style from './index.module.css';
import SttTypeSelect from './select-stt-json-type';
import ExportFormatSelect from './select-export-format';

const tedTalkVideoUrl = 'https://download.ted.com/talks/KateDarling_2018S-950k.mp4';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transcriptData: null,
      mediaUrl: null,
      isTextEditable: true,
      sttType: 'bbckaldi',
    };
    // this.handleChangeLoadTranscriptJson = this.handleChangeLoadTranscriptJson.bind(this);
  }

  loadDemo() {
    this.setState({
      transcriptData: kaldiTedTalkTranscript,
      mediaUrl: tedTalkVideoUrl,
      sttType: 'bbckaldi',
    });
  }

  // https://stackoverflow.com/questions/8885701/play-local-hard-drive-video-file-with-html5-video-tag
  handleChangeLoadMedia(files) {
    console.log(files);
    const file = files[0];
    const type = file.type;
    // check if is playable
    const videoNode = document.createElement('video');
    const canPlay = videoNode.canPlayType(type);
    if (canPlay) {
      const fileURL = URL.createObjectURL(file);
      // videoNode.src = fileURL
      this.setState({
        // transcriptData: kaldiTedTalkTranscript,
        mediaUrl: fileURL,
      });
    }
  }

  handleChangeLoadMediaUrl() {
    const fileURL = prompt("Paste the URL you'd like to use here");

    this.setState({
      // transcriptData: kaldiTedTalkTranscript,
      mediaUrl: fileURL,
    });
  }

  handleChangeLoadTranscriptJson(files) {
    const self = this;
    const file = files[0];
    // let type = file.type;
    // TODO: add checks
    // let transcriptJsonContent = FileReader.readAsText(file)
    const fr = new FileReader();
    fr.onload = function (e) {
      // e.target.result should contain the text
      console.log(JSON.parse(e.target.result));
      self.setState({
        transcriptData: JSON.parse(e.target.result),
        // mediaUrl: tedTalkVideoUrl
      });
    };
    fr.readAsText(file);
  }

  handleIsTextEditable = () => {
    this.setState((prevState) => ({ isTextEditable: (prevState.isTextEditable) !== true }));
  }

  // https://stackoverflow.com/questions/21733847/react-jsx-selecting-selected-on-selected-select-option
  handleSttTypeChange = (event) => {
    console.log(event.target.name, event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  }

  handleExportFormatChange = (event) => {
    console.log(event.target.name, event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  }

  exportTranscript = () => {
    // eslint-disable-next-line react/no-string-refs
    const { data, ext } = this.refs.transcriptEditor.getEditorContent(this.state.exportFormat);
    this.download(data, `${ this.state.mediaUrl }.${ ext }`);
  }

  // https://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
   download = (content, filename, contentType) => {
     const type = contentType || 'application/octet-stream';
     const a = document.createElement('a');
     const blob = new Blob([ content ], { type: type });

     a.href = window.URL.createObjectURL(blob);
     a.download = filename;
     a.click();
   }

   clearLocalStorage = () => {
     localStorage.clear();
     console.info('cleared local storage');
   }

   render() {
     return (
       <div className={ style.container }>
         <span className={ style.title }>
            Demo page for <mark>React Transcript Editor</mark> - Component |{' '}
           <a
             href="https://github.com/bbc/react-transcript-editor"
             rel="noopener noreferrer"
             target="_blank"
           >
            Github Repo
           </a>
         </span>
         <br />
         <button onClick={ () => this.loadDemo() }>load demo</button>
         <hr />
         <label>open Transcript Json</label>
         <SttTypeSelect
           name={ 'sttType' }
           value={ this.state.sttType }
           handleChange={ this.handleSttTypeChange }
         />
         <input
           type="file"
           onChange={ e => this.handleChangeLoadTranscriptJson(e.target.files) }
         />

         <br />
         <label>Load Local Media</label>
         <input
           type="file"
           onChange={ e => this.handleChangeLoadMedia(e.target.files) }
         />
         or
         <button onClick={ () => this.handleChangeLoadMediaUrl() }>
          Load Media From Url
         </button>

         <br />
         <label>Export transcript</label>
         <button onClick={ () => this.exportTranscript() }>Export file</button>

         <ExportFormatSelect
           name={ 'exportFormat' }
           value={ this.state.exportFormat }
           handleChange={ this.handleExportFormatChange }
         />
         <br />
         <label>Text Is Editable</label>
         <label className={ style.switch }>
           <input type="checkbox"
             defaultChecked="true"
             onChange={ this.handleIsTextEditable }
           />
           <span className={ style.slider }></span>
         </label>
         <br />
         <button onClick={ () => this.clearLocalStorage() }>Clear Local Storage</button>
         <hr/>

         <TranscriptEditor
           transcriptData={ this.state.transcriptData }
           mediaUrl={ this.state.mediaUrl }
           isEditable={ this.state.isTextEditable }
           sttJsonType={ this.state.sttType }
           // eslint-disable-next-line react/no-string-refs
           ref={ 'transcriptEditor' }
         />
       </div>
     );
   }
}

render(<App />, document.getElementById('root'));
