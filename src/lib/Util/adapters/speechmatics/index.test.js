import bbcKaldiToDraft from './index';

import draftTranscriptExample from './sample/bbcKaldiToDraft.sample.js';
import kaldiTedTalkTranscript from './sample/kaldiTedTalkTranscript.sample.json';

// TODO: figure out why the second of these two tests hang
// might need to review the draftJS data structure output
describe('bbcKaldiToDraft', () => {
  const result = bbcKaldiToDraft(kaldiTedTalkTranscript);
  it('Should be defined', ( ) => {
    expect(result).toBeDefined();
  });

  it('Should be equal to expected value', ( ) => {
    expect(result).toEqual(draftTranscriptExample);
  });
});
