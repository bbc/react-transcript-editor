import React from 'react';
import { render } from "react-dom";
import { TranscriptEditor } from "./lib";
// import kaldiTranscript from './sample-data/kaldi-transcription-20181029235300.json';
import kaldiTedTalkTranscript from './sample-data/KateDarling_2018S-bbc-kaldi.json';

import styles from './index.module.css';

const tedTalkVideoUrl = 'https://download.ted.com/talks/KateDarling_2018S-950k.mp4';

const App = () => (
  <div className={styles.container}>
    <TranscriptEditor 
      transcriptData={kaldiTedTalkTranscript} 
      mediaUrl={tedTalkVideoUrl}
    />
  </div>
);

render(<App />, document.getElementById("root"));
