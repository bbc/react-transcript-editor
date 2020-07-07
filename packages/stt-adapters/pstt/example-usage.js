import psttToDraft from './index.js';
// using require, because of testing outside of React app
import kaldiTedTalkTranscript from './sample/pstt.sample.json';

const result = psttToDraft(kaldiTedTalkTranscript);

console.log(JSON.stringify(result, null, 2));
