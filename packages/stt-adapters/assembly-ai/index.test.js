import assebleToDraft from './index';

import draftTranscriptExample from './sample/assembleToDraft.sample.js';
import assembleTedTalkTranscript from './sample/assembly_example.json';

describe('assembleToDraft', () => {
  const result = assebleToDraft(assembleTedTalkTranscript);
  it('Should be defined', ( ) => {
    expect(result).toBeDefined();
  });

  it('Should be equal to expected value', ( ) => {
    expect(result).toEqual(draftTranscriptExample);
  });
});
