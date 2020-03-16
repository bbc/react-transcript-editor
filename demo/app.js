import React from "react";

import TranscriptEditor from "../packages/components/transcript-editor";
import SttTypeSelect from "./select-stt-json-type";
import ExportFormatSelect from "./select-export-format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import {
  loadLocalSavedData,
  isPresentInLocalStorage,
  localSave
} from "./local-storage.js";

import DEMO_TRANSCRIPT_KATE from "./sample-data/KateDarling-bbcKaldiTranscriptWithSpeakerSegments.json";
const DEMO_MEDIA_URL_KATE =
  "https://download.ted.com/talks/KateDarling_2018S-950k.mp4";
const DEMO_TITLE_KATE =
  "TED Talk | Kate Darling - Why we have an emotional connection to robots";

import DEMO_TRANSCRIPT_ZUCK_5HOURS_DPE from "./sample-data/Facebook-CEO-Mark-Zuckerberg-FULL-testimony-before-U.S.senate-pXq-5L2ghhg.mp4.dpe.json";
import DEMO_TRANSCRIPT_ZUCK_5HOURS_DRAFTJS from "./sample-data/Facebook-CEO-Mark-Zuckerberg-FULL-testimony-before-U.S.senate-pXq-5L2ghhg.mp4.draftjs.json";
const DEMO_MEDIA_URL_ZUCK_5HOURS =
  "https://democratic-presidential-debate-stt-analyses.s3.us-east-2.amazonaws.com/Facebook+CEO+Mark+Zuckerberg+FULL+testimony+before+U.S.+senate-pXq-5L2ghhg.mp4";
const DEMO_TITLE_ZUCK =
  "Facebook CEO Mark Zuckerberg | full testimony before U.S. Senate";

const DEMOS = [
  {
    id: 'kate',
    title: DEMO_TITLE_KATE,
    json: DEMO_TRANSCRIPT_KATE,
    url: DEMO_MEDIA_URL_KATE,
    type: "bbckaldi"
  },
  {
    id: 'zuckDraftJs',
    title: DEMO_TITLE_ZUCK,
    json: DEMO_TRANSCRIPT_ZUCK_5HOURS_DRAFTJS,
    url: DEMO_MEDIA_URL_ZUCK_5HOURS,
    type: 'draftjs'
  },
  {
    id: 'zuckDpe',
    title: DEMO_TITLE_ZUCK,
    json: DEMO_TRANSCRIPT_ZUCK_5HOURS_DPE,
    url: DEMO_MEDIA_URL_ZUCK_5HOURS,
    type: 'digitalpaperedit'
  },
]

import style from "./index.module.scss";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transcriptData: null,
      mediaUrl: null,
      isTextEditable: true,
      spellCheck: false,
      sttType: "bbckaldi",
      analyticsEvents: [],
      title: "",
      fileName: "",
      autoSaveData: {},
      autoSaveContentType: "draftjs",
      autoSaveExtension: "json",
      useLocalStorage: true
    };

    this.transcriptEditorRef = React.createRef();
  }

  loadDemo = (demoId) => {
    const demo = DEMOS.find((d)=>{
      return d.id === demoId;
    })
    console.log(demo)
    const DEMO_TRANSCRIPT = demo.json;
    const DEMO_MEDIA_URL = demo.url;
    const DEMO_TITLE = demo.title;
    const DEMO_TYPE = demo.type

      if(this.state.useLocalStorage && isPresentInLocalStorage(DEMO_MEDIA_URL)){
        const transcriptDataFromLocalStorage = loadLocalSavedData(DEMO_MEDIA_URL)
        this.setState({
          transcriptData: transcriptDataFromLocalStorage,
          mediaUrl: DEMO_MEDIA_URL,
          title: DEMO_TITLE,
          // if loading from local storage, always saved in draftJS format 
          sttType: 'draftjs'
        });
      }
      else{
        this.setState({
          transcriptData: DEMO_TRANSCRIPT,
          mediaUrl: DEMO_MEDIA_URL,
          title: DEMO_TITLE,
          sttType: DEMO_TYPE
        });
      }
  };

  // https://stackoverflow.com/questions/8885701/play-local-hard-drive-video-file-with-html5-video-tag
  handleLoadMedia = files => {
    const file = files[0];
    const videoNode = document.createElement("video");
    const canPlay = videoNode.canPlayType(file.type);

    if (canPlay) {
      const fileURL = URL.createObjectURL(file);
      this.setState({
        // transcriptData: DEMO_TRANSCRIPT,
        mediaUrl: fileURL,
        fileName: file.name
      });
    } else {
      alert("Select a valid audio or video file.");
    }
  };

  handleLoadMediaUrl = () => {
    const fileURL = prompt("Paste the URL you'd like to use here:");

    this.setState({
      // transcriptData: DEMO_TRANSCRIPT,
      mediaUrl: fileURL
    });
  };

  handleLoadTranscriptJson = files => {
    const file = files[0];

    if (file.type === "application/json") {
      const fileReader = new FileReader();

      fileReader.onload = event => {
        this.setState({
          transcriptData: JSON.parse(event.target.result)
        });
      };

      fileReader.readAsText(file);
    } else {
      alert("Select a valid JSON file.");
    }
  };

  handleIsTextEditable = e => {
    this.setState({
      isTextEditable: e.target.checked
    });
  };

  handleSpellCheck = e => {
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
    console.log("export");
    // eslint-disable-next-line react/no-string-refs
    const { data, ext } = this.transcriptEditorRef.current.getEditorContent(
      this.state.exportFormat
    );
    let tmpData = data;
    if (ext === "json") {
      tmpData = JSON.stringify(data, null, 2);
    }
    if (ext !== "docx") {
      this.download(tmpData, `${this.state.mediaUrl}.${ext}`);
    }
  };

  // https://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
  download = (content, filename, contentType) => {
    console.log("download");
    const type = contentType || "application/octet-stream";
    const link = document.createElement("a");
    const blob = new Blob([content], { type: type });

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
    console.info("Cleared local storage.");
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

  handleAutoSaveChanges = newAutoSaveData => {
    const { data, ext } = newAutoSaveData;
    this.setState({ autoSaveData: data, autoSaveExtension: ext });
    // Saving to local storage 
    if(this.state.useLocalStorage){
      localSave(this.state.mediaUrl, this.state.fileName, data);
    }
  };

  handleUseLocalStorage = ()=>{
    this.setState((prevState)=>{
      return {useLocalStorage: !prevState.useLocalStorage}
    }, ()=>{
      console.log('this.state.useLocalStorage',this.state.useLocalStorage)
    })
  }
  render() {
    return (
      <div className={style.container}>
        <span><code>@pietro/react-transcript-editor</code>React Transcript Editor Demo </span>
        <a
          href="https://github.com/pietrop/react-transcript-editor"
          rel="noopener noreferrer"
          target="_blank"
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>
        <div className={style.demoNav}>
          <section className={style.demoNavItem}>
            <label className={style.sectionLabel}>Demos</label>
            <button
              className={style.demoButton}
              onClick={() => this.loadDemo('kate')}
            >
              Kate TedTalk 12Min
            </button>
            <button
              className={style.demoButton}
              onClick={() => this.loadDemo('zuckDraftJs')}
            >
             Zuck 5h DraftJS
            </button>
            <button
              className={style.demoButton}
              onClick={() => this.loadDemo('zuckDpe')}
            >
            Zuck 5h DPE
            </button>
            
          </section>

          <section className={style.demoNavItem}>
            <label className={style.sectionLabel}>Load Media</label>
            <button onClick={() => this.handleLoadMediaUrl()}> From URL</button>
            <input
              type={"file"}
              id={"mediaFile"}
              onChange={e => this.handleLoadMedia(e.target.files)}
            />
            <label htmlFor="mediaFile">From Computer</label>
            {this.state.fileName !== "" ? (
              <label className={style.fileNameLabel}>
                {this.state.fileName}
              </label>
            ) : null}
          </section>

          <section className={style.demoNavItem}>
            <label className={style.sectionLabel}>Load Transcript</label>
            <SttTypeSelect
              className={style.dropdown}
              name={"sttType"}
              value={this.state.sttType}
              handleChange={this.handleSttTypeChange}
            />

            <input
              type={"file"}
              id={"transcriptFile"}
              onChange={e => this.handleLoadTranscriptJson(e.target.files)}
            />
            <label htmlFor="transcriptFile">From Computer</label>
            {this.state.transcriptData !== null ? (
              <label className={style.fileNameLabel}>Transcript loaded.</label>
            ) : null}
          </section>

          <section className={style.demoNavItem}>
            <label className={style.sectionLabel}>Export Transcript</label>
            <ExportFormatSelect
              className={style.dropdown}
              name={"exportFormat"}
              value={this.state.exportFormat}
              handleChange={this.handleExportFormatChange}
            />
            <button onClick={() => this.exportTranscript()}>Export File</button>
          </section>

          <section className={style.demoNavItem}>
            <label className={style.sectionLabel}>
              Transcript Title
              <span className={style.titleLabel}>(Optional)</span>
            </label>
            <input
              type="text"
              value={this.state.title}
              onChange={e => this.handleChangeTranscriptTitle(e.target.value)}
            />
          </section>

          <section className={style.demoNavItem}>
            <label className={style.sectionLabel}>Options</label>

            <div className={style.checkbox}>
              <label
                className={style.editableLabel}
                htmlFor={"textIsEditableCheckbox"}
              >
                Text Is Editable
              </label>
              <input
                id={"textIsEditableCheckbox"}
                type="checkbox"
                checked={this.state.isTextEditable}
                onChange={this.handleIsTextEditable}
              />
            </div>

            <div className={style.checkbox}>
              <label
                className={style.editableLabel}
                htmlFor={"spellCheckCheckbox"}
              >
                Spell Check
              </label>
              <input
                id={"spellCheckCheckbox"}
                type="checkbox"
                checked={this.state.spellCheck}
                onChange={this.handleSpellCheck}
              />
            </div>

            <div className={style.checkbox}>
              <label
                className={style.editableLabel}
                htmlFor={"spellCheckCheckbox"}
              >
                Use local storage
              </label>
              <input
                id={"useLocalStorage"}
                type="checkbox"
                checked={this.state.useLocalStorage}
                onChange={this.handleUseLocalStorage}
              />
            </div>

            <button
              className={style.warningButton}
              onClick={() => this.clearLocalStorage()}
            >
              Clear Local Storage
            </button>
          </section>
        </div>

        <TranscriptEditor
          transcriptData={this.state.transcriptData}
          fileName={this.state.fileName}
          mediaUrl={this.state.mediaUrl}
          isEditable={this.state.isTextEditable}
          spellCheck={this.state.spellCheck}
          sttJsonType={this.state.sttType}
          handleAnalyticsEvents={this.handleAnalyticsEvents}
          title={this.state.title}
          ref={this.transcriptEditorRef}
          handleAutoSaveChanges={this.handleAutoSaveChanges}
          autoSaveContentType={this.state.autoSaveContentType}
          mediaType={ 'video' }
        />

        <section style={{ height: "250px", width: "50%", float: "left" }}>
          <h3>Components Analytics</h3>
          <textarea
            style={{ height: "100%", width: "100%" }}
            value={JSON.stringify(this.state.analyticsEvents, null, 2)}
            disabled
          />
        </section>

        <section style={{ height: "250px", width: "50%", float: "right" }}>
          <h3>
            Auto Save data:{" "}
            <code>
              {this.state.autoSaveContentType}| {this.state.autoSaveExtension}
            </code>
          </h3>
          <textarea
            style={{ height: "100%", width: "100%" }}
            value={
              this.state.autoSaveExtension === "json"
                ? JSON.stringify(this.state.autoSaveData, null, 2)
                : this.state.autoSaveData
            }
            disabled
          />
        </section>
      </div>
    );
  }
}

export default App;