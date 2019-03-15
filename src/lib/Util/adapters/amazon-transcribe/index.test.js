import amazonTranscribeToDraft from './index';
import amazonTranscribeTedTalkTranscript from './sample/amazonTranscribe.sample.json';
import draftTranscriptSample from './sample/amazonTranscribe.sample.js';

describe('amazonTranscribeToDraft', () => {
  const result = amazonTranscribeToDraft(amazonTranscribeTedTalkTranscript);
  it('Should be defined', ( ) => {
    expect(result).toBeDefined();
  });

  it('Should be equal to expected value', () => {
    expect(result).toEqual(draftTranscriptSample);
  });
});
