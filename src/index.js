import React from 'react';
import { render } from 'react-dom';
import { TranscriptEditor } from './lib';
// import kaldiTranscript from './sample-data/kaldi-transcription-20181029235300.json';
import kaldiTedTalkTranscript from './sample-data/KateDarling_2018S-bbc-kaldi.json';
import styles from './index.module.css';

const tedTalkVideoUrl =
  'https://download.ted.com/talks/KateDarling_2018S-950k.mp4';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transcriptData: null,
      mediaUrl: null
    };
    // this.handleChangeLoadTranscriptJson = this.handleChangeLoadTranscriptJson.bind(this);
  }
  loadDemo() {
    this.setState({
      transcriptData: kaldiTedTalkTranscript,
      mediaUrl: tedTalkVideoUrl
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

            <hr/>

            <TranscriptEditor
          transcriptData={ this.state.transcriptData }
          mediaUrl={ this.state.mediaUrl }
        />
        </div>
    );
  }
}

render(<App />, document.getElementById('root'));
