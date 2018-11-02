import React from 'react';
import { render } from "react-dom";
import { TranscriptEditor } from "./lib";
// import kaldiTranscript from './sample-data/kaldi-transcription-20181029235300.json';
import kaldiTedTalkTranscript from './sample-data/KateDarling_2018S-bbc-kaldi.json';
const tedTalkVideoUrl = 'https://download.ted.com/talks/KateDarling_2018S-950k.mp4';

const App = () => (
  <div style={{ width: 640, margin: "15px auto" }}>
    <h1>Transcript Editor - Example usage</h1>
    <TranscriptEditor 
      transcriptData={kaldiTedTalkTranscript} 
      mediaUrl={tedTalkVideoUrl}
    />
  </div>
);

render(<App />, document.getElementById("root"));
