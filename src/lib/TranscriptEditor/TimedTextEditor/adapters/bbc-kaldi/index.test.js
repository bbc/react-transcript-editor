import bbcKaldiToDraft from './index.js';

import draftTranscriptExample  from './sample/bbcKaldiToDraft-sample.js';
import kaldiTedTalkTranscript from './sample/kaldiTedTalkTranscript-sample.json';

describe('bbcKaldiToDraft', function () {
  const result = bbcKaldiToDraft(kaldiTedTalkTranscript);
  it('Should be defined', ( )=> {
    expect(result).toBeDefined();
  })

  it('Should be equal to expected value', ( )=> {
    expect(result).toEqual(draftTranscriptExample);
  })
})