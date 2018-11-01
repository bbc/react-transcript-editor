import React from 'react';
import { render } from "react-dom";
import { TranscriptEditor } from "./lib";
import kaldiTranscript from './sample-data/kaldi-transcription-20181029235300.json';

const App = () => (
  <div style={{ width: 640, margin: "15px auto" }}>
    <h1>Transcript Editor - Example usage</h1>
    <TranscriptEditor transcriptData={kaldiTranscript} />
  </div>
);

render(<App />, document.getElementById("root"));
