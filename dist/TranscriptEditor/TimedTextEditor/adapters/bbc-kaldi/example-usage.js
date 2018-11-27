const bbcKaldiToDraft = require('./index'); // using require, because of testing outside of React app


const kaldiTedTalkTranscript = require('../../../../../sample-data/KateDarling_2018S-bbc-kaldi.json');

const result = bbcKaldiToDraft(kaldiTedTalkTranscript);
console.log(result);