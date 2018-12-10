import bbcKaldiToDraft from './index';

import draftTranscriptExample from './sample/bbcKaldiToDraft-sample';
import kaldiTedTalkTranscript from './sample/kaldiTedTalkTranscript-sample.json';

describe('bbcKaldiToDraft', () => {
  const result = bbcKaldiToDraft(kaldiTedTalkTranscript);
  it('Should be defined', ( ) => {
    expect(result).toBeDefined();
  });

  it('Should be equal to expected value', ( ) => {
    expect(result).toEqual(draftTranscriptExample);
  });
});
