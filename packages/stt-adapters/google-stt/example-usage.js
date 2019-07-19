import gcpSttToDraft from './index';
import gcpSttTedTalkTranscript from './sample/gcpSttPunctuation.sample.json';

console.log('Starting');
console.log(JSON.stringify(gcpSttToDraft(gcpSttTedTalkTranscript), null, 2));
