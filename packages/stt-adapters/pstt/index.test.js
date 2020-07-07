import psttToDraft from './index';

import psttTranscriptSample from './sample/pstt.sample.json';
import draftTranscriptSample from './sample/psttToDraftJs.sample.js';

describe('Platform STT to Draft', () => {
  const result = psttToDraft(psttTranscriptSample);
  it('Should be defined', ( ) => {
    expect(result).toBeDefined();
  });

  it('Should be equal to expected value', ( ) => {
    expect(result).toEqual(draftTranscriptSample);
  });
});
