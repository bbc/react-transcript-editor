const digitalPaperEditToDraft = require('./index');
// using require, because of testing outside of React app
const kaldiTedTalkTranscript = require('./sample/digitalPaperEdit.sample.json');

const result = digitalPaperEditToDraft(kaldiTedTalkTranscript);

console.log(result);