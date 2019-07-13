import digitalPaperEditToDraft from './index.js';
// using require, because of testing outside of React app
import kaldiTedTalkTranscript from './sample/digitalPaperEdit.sample.json';

const result = digitalPaperEditToDraft(kaldiTedTalkTranscript);

console.log(JSON.stringify(result, null, 2));