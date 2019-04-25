import draftToDigitalPaperEdit from './index.js';

import digitalPaperEditTranscript from './digitalPaperEdit.sample.json';
import draftTranscriptExample from './draftjs.sample.json';

describe('Draft Js to Digital Paper Edit', () => {
  const result = draftToDigitalPaperEdit(draftTranscriptExample);
  it('Should be defined', ( ) => {
    expect(result).toBeDefined();
  });

  it('Should be equal to expected value', ( ) => {
    expect(result).toEqual(digitalPaperEditTranscript);
  });
});
