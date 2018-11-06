const bbcKaldiToDraft = require('./index.js'); // using require, because of testing outside of React app


const kaldiTedTalkTranscript = require('../../../../../sample-data/KateDarling_2018S-bbc-kaldi.json');

let result = bbcKaldiToDraft(kaldiTedTalkTranscript);
console.log(result);