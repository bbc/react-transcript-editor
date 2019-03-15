import speechmaticsToDraft from './index';

import draftTranscriptExample from './sample/speechmaticsToDraft.sample.js';
import speechmaticsTedTalkTranscript from './sample/speechmaticsTedTalkTranscript.sample.json';

// TODO: figure out why the second of these two tests hang
// might need to review the draftJS data structure output
describe('speechmaticsToDraft', () => {
  const result = speechmaticsToDraft(speechmaticsTedTalkTranscript);
  it('Should be defined', ( ) => {
    expect(result).toBeDefined();
  });

  it('Should be equal to expected value', ( ) => {
    expect(result).toEqual(draftTranscriptExample);
  });
});
