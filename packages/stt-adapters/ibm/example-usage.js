import ibmToDraft from './index.js';
import ibmTedTalkTranscript from './sample/ibmTedTalkTranscript.sample.json';

const result = ibmToDraft(ibmTedTalkTranscript);

console.log(JSON.stringify(result, null, 2));