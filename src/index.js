import React from 'react';
import { render } from 'react-dom';
import { TranscriptEditor } from './lib';
// import kaldiTranscript from './sample-data/kaldi-transcription-20181029235300.json';
import kaldiTedTalkTranscript from './sample-data/KateDarling_2018S-bbc-kaldi.json';
import styles from './index.module.css';
import SttTypeSelect from './select-stt-json-type.js'

const tedTalkVideoUrl =
  'https://download.ted.com/talks/KateDarling_2018S-950k.mp4';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transcriptData: null,
      mediaUrl: null,
      isTextEditable: true,
      sttType: 'bbckaldi'
    };
    // this.handleChangeLoadTranscriptJson = this.handleChangeLoadTranscriptJson.bind(this);
  }
  loadDemo() {
    this.setState({
      transcriptData: kaldiTedTalkTranscript,
      mediaUrl: tedTalkVideoUrl,
      sttType: 'bbckaldi'
    });
  }

  // https://stackoverflow.com/questions/8885701/play-local-hard-drive-video-file-with-html5-video-tag
  handleChangeLoadMedia(files) {
    console.log(files);
    const file = files[ 0 ];
    const type = file.type;
    // check if is playable
    const videoNode = document.createElement('video');
    const canPlay = videoNode.canPlayType(type);
    if (canPlay) {
      var fileURL = URL.createObjectURL(file);
      // videoNode.src = fileURL
      this.setState({
        // transcriptData: kaldiTedTalkTranscript,
        mediaUrl: fileURL
      });
    }
  }

  handleChangeLoadMediaUrl() {
    const fileURL = prompt("Paste the URL you'd like to use here");

    this.setState({
      // transcriptData: kaldiTedTalkTranscript,
      mediaUrl: fileURL
    });
  }

  handleChangeLoadTranscriptJson(files) {
    const self = this;
    const file = files[ 0 ];
    // let type = file.type;
    // TODO: add checks
    // let transcriptJsonContent = FileReader.readAsText(file)
    var fr = new FileReader();
    fr.onload = function(e) {
      // e.target.result should contain the text
      console.log(JSON.parse(e.target.result));
      self.setState({
        transcriptData: JSON.parse(e.target.result)
        // mediaUrl: tedTalkVideoUrl
      });
    };
    fr.readAsText(file);
  }

  handleIsTextEditable = (e)=>{
    this.setState((prevState,props) => {
      return { isTextEditable: (prevState.isTextEditable) === true ? false: true }
    })
  }

  // https://stackoverflow.com/questions/21733847/react-jsx-selecting-selected-on-selected-select-option
  handleSttTypeChange = (event) =>{
    console.log(event.target.name ,event.target.value )
    this.setState({ [ event.target.name ]: event.target.value });
  }

  render() {
    return (
        <div className={ styles.container }>
            <span className={ styles.title }>
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
            <br />
            <label>open Transcript Json</label>
            <input
          type="file"
          onChange={ e => this.handleChangeLoadTranscriptJson(e.target.files) }
        />
            <SttTypeSelect
            name={ 'sttType' }
            value={ this.state.sttType }
            handleChange={ this.handleSttTypeChange }
           />

            <br />
            <label>Load Local Media</label>
            <input
          type="file"
          onChange={ e => this.handleChangeLoadMedia(e.target.files) }
        />
            <br />
            <button onClick={ () => this.handleChangeLoadMediaUrl() }>
          Load Media From Url
            </button>

            <p>Text Is Editable
                <label className={ styles.switch }>
                    <input type="checkbox" 
                  defaultChecked="true" 
                  onChange={ this.handleIsTextEditable }
                  />
                    <span className={ styles.slider }></span>
                </label>
            </p>

            <hr/>

            <TranscriptEditor
              transcriptData={ this.state.transcriptData }
              mediaUrl={ this.state.mediaUrl }
              isEditable={ this.state.isTextEditable }
              sttJsonType={ this.state.sttType }
            />
        </div>
    );
  }
}

render(<App />, document.getElementById('root'));
