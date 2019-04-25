import digitalPaperEditToDraft from './index';

// TODO .js coz you need to change the keys for draftJs entities to in jest format
// import draftTranscriptExample from './sample/ibmToDraft.sample.js';
import digitalPaperEditTranscript from './sample/digitalPaperEdit.sample.json';
import draftTranscriptSample from './sample/digitalPaperEditToDraftJs.sample.js';

describe('Digital Paper Edit to Draft', () => {
  const result = digitalPaperEditToDraft(digitalPaperEditTranscript);
  it('Should be defined', ( ) => {
    expect(result).toBeDefined();
  });

  it('Should be equal to expected value', ( ) => {
    expect(result).toEqual(draftTranscriptSample);
  });
});
