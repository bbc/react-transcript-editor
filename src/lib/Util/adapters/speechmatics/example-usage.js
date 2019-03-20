const speechmaticsToDraft = require('./index');
// using require, because of testing outside of React app
const speechmaticsTedTalkTranscript = require('./sample/speechmaticsTedTalkTranscript.sample.json');

const result = speechmaticsToDraft(speechmaticsTedTalkTranscript);

console.log(result);
