import bbcKaldiToDraft from './index';

import draftTranscriptExample from './sample/bbcKaldiToDraft.sample.js';
import kaldiTedTalkTranscript from './sample/kaldiTedTalkTranscript.sample.json';

// TODO: figure out why the second of these two tests hang
// might need to review the draftJS data structure output
describe('bbcKaldiToDraft', () => {
  it('Should be defined', () => {
    const result = bbcKaldiToDraft(kaldiTedTalkTranscript);

    expect(result).toBeDefined();
  });

  it('Should be equal to expected value', () => {
    const result = bbcKaldiToDraft(kaldiTedTalkTranscript);

    expect(result).toEqual(draftTranscriptExample);
  });

  it('Should sort words with no segmentation and no ending punctuation into paragraphs', () => {
    const data = {
      retval: {
        words: [
          {
            start: 1.00,
            confidence: 0.68,
            end: 1.17,
            word: 'test',
            punct: 'Test',
            index: 0,
          },
          {
            start: 1.17,
            confidence: 0.61,
            end: 1.38,
            word: 'words',
            punct: 'words',
            index: 1,
          },
        ]
      }
    };

    const result = bbcKaldiToDraft(data);

    expect(result.length).toEqual(1);
  });

  it('Should sort words with no segmentation and no ending punctuation into paragraphs', () => {
    const data = {
      retval: {
        words: [
          {
            start: 1.00,
            confidence: 0.68,
            end: 1.17,
            word: 'test',
            punct: 'Test',
            index: 0,
          },
          {
            start: 1.17,
            confidence: 0.61,
            end: 1.38,
            word: 'words',
            punct: 'words.',
            index: 1,
          },
          {
            start: 1.38,
            confidence: 0.99,
            end: 1.44,
            word: 'second',
            punct: 'Second',
            index: 2,
          },
          {
            start: 11.00,
            confidence: 0.68,
            end: 11.17,
            word: 'paragraph',
            punct: 'paragraph',
            index: 3,
          },
        ]
      }
    };

    const result = bbcKaldiToDraft(data);

    expect(result.length).toEqual(2);
  });
});
