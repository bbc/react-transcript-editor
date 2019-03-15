import amazonTranscribeToDraft from './index';
import amazonTranscribeTedTalkTranscript from './sample/amazonTranscribe.sample.json';

console.log(JSON.stringify(amazonTranscribeToDraft(amazonTranscribeTedTalkTranscript), null, 2));
