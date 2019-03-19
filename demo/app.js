import React from "react";
import { render } from "react-dom";

import TranscriptEditor from "@bbc-transcript-editor/editor";

import kaldiTedTalkTranscript from "./sample-data/KateDarling_2018S-bbc-kaldi.json";
import style from "./index.module.css";
import SttTypeSelect from "./select-stt-json-type";
import ExportFormatSelect from "./select-export-format";

const tedTalkVideoUrl =
  "https://download.ted.com/talks/KateDarling_2018S-950k.mp4";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transcriptData: null,
      mediaUrl: null,
      isTextEditable: true,
      sttType: "bbckaldi",
      analyticsEvents: [],
      title: "Ted Talk Kate Kate Darling",
      fileName: ""
    };

    this.transcriptEditorRef = React.createRef();
  }

  loadDemo() {
    this.setState({
      transcriptData: kaldiTedTalkTranscript,
      mediaUrl: tedTalkVideoUrl,
      sttType: "bbckaldi"
    });
  }

  // https://stackoverflow.com/questions/8885701/play-local-hard-drive-video-file-with-html5-video-tag
  handleChangeLoadMedia(files) {
    console.log(files);
    const file = files[0];
    const type = file.type;
    // check if is playable
    const videoNode = document.createElement("video");
    const canPlay = videoNode.canPlayType(type);
    if (canPlay) {
      const fileURL = URL.createObjectURL(file);
      // videoNode.src = fileURL
      this.setState({
        // transcriptData: kaldiTedTalkTranscript,
        mediaUrl: fileURL,
        fileName: file.name
      });
    } else {
      alert("select a valid audio or video file");
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
    const file = files[0];

    if (file.type === "application/json") {
      const fr = new FileReader();

      fr.onload = evt => {
        this.setState({
          transcriptData: JSON.parse(evt.target.result)
        });
      };

      fr.readAsText(file);
    } else {
      alert("select a valid json file");
    }
  }

  handleIsTextEditable = () => {
    this.setState(prevState => ({
      isTextEditable: prevState.isTextEditable !== true
    }));
  };

  // https://stackoverflow.com/questions/21733847/react-jsx-selecting-selected-on-selected-select-option
  handleSttTypeChange = event => {
    console.log(event.target.name, event.target.value);
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
    this.download(data, `${this.state.mediaUrl}.${ext}`);
  };

  // https://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
  download = (content, filename, contentType) => {
    const type = contentType || "application/octet-stream";
    const a = document.createElement("a");
    const blob = new Blob([content], { type: type });

    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  clearLocalStorage = () => {
    localStorage.clear();
    console.info("cleared local storage");
  };

  handleAnalyticsEvents = event => {
    this.setState({ analyticsEvents: [...this.state.analyticsEvents, event] });
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
      <div className={style.container}>
        <span>
          Demo page for <mark>React Transcript Editor</mark> - Component |{" "}
          <a
            href="https://github.com/bbc/react-transcript-editor"
            rel="noopener noreferrer"
            target="_blank"
          >
            Github Repo
          </a>
        </span>
        <br />
        <button onClick={() => this.loadDemo()}>load demo</button>
        <hr />
        <label>Load Local Media</label>
        <input
          type="file"
          onChange={e => this.handleChangeLoadMedia(e.target.files)}
        />
        or
        <button onClick={() => this.handleChangeLoadMediaUrl()}>
          Load Media From Url
        </button>
        <br />
        <label>open Transcript Json</label>
        <SttTypeSelect
          name={"sttType"}
          value={this.state.sttType}
          handleChange={this.handleSttTypeChange}
        />
        <input
          type="file"
          onChange={e => this.handleChangeLoadTranscriptJson(e.target.files)}
        />
        <br />
        <label>Export transcript</label>
        <button onClick={() => this.exportTranscript()}>Export file</button>
        <ExportFormatSelect
          name={"exportFormat"}
          value={this.state.exportFormat}
          handleChange={this.handleExportFormatChange}
        />
        <br />
        <label>Text Is Editable</label>
        <label>
          <input
            type="checkbox"
            defaultChecked="true"
            onChange={this.handleIsTextEditable}
          />
        </label>
        <br />
        <label>Optional Transcript Name</label>
        <input
          type="text"
          value={this.state.title}
          onChange={e => this.handleChangeTranscriptTitle(e.target.value)}
        />
        <br />
        <button onClick={() => this.clearLocalStorage()}>
          Clear Local Storage
        </button>
        <hr />
        <TranscriptEditor
          transcriptData={this.state.transcriptData}
          fileName={this.state.fileName}
          mediaUrl={this.state.mediaUrl}
          isEditable={this.state.isTextEditable}
          sttJsonType={this.state.sttType}
          handleAnalyticsEvents={this.handleAnalyticsEvents}
          title={this.state.title}
          ref={this.transcriptEditorRef}
        />
        <hr />
        <label>Components Analytics</label>
        <textarea
          style={{ height: "200px", width: "100%" }}
          value={JSON.stringify(this.state.analyticsEvents, null, 2)}
          disabled
        />
      </div>
    );
  }
}

export default App;
