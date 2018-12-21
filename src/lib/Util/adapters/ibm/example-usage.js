const ibmToDraft = require('./index');
// using require, because of testing outside of React app
const ibmTedTalkTranscript = require('./sample/ibmTedTalkTranscript.sample.json');

const result = ibmToDraft(ibmTedTalkTranscript);

console.log(result);
