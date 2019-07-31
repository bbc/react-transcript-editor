const bbcKaldiToDraft = require('./index');
// using require, because of testing outside of React app
const kaldiTedTalkTranscript = require('./sample/kaldiTedTalkTranscript.sample.json');

const result = bbcKaldiToDraft(kaldiTedTalkTranscript);

console.log(result);