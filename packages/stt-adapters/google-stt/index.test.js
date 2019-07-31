import gcpSttToDraft, {
  getBestAlternativeSentence,
  trimLeadingAndTailingWhiteSpace
} from './index';
import draftTranscriptSample from './sample/googleSttToDraftJs.sample.js';
import gcpSttTedTalkTranscript from './sample/gcpSttPunctuation.sample.json';

describe('gcpSttToDraft', () => {
  const result = gcpSttToDraft(gcpSttTedTalkTranscript);
  it('Should be defined', () => {
    expect(result).toBeDefined();
  });

  it('Should be equal to expected value', () => {
    expect(result).toEqual(draftTranscriptSample);
  });
});

describe('leading and tailing white space should be removed from text block', () => {
  const sentence = ' this is   a sentence ';
  const expected = 'this is   a sentence';

  const result = trimLeadingAndTailingWhiteSpace(sentence);
  it('should be equal to expected value', () => {
    expect(result).toEqual(expected);
  });
});

describe('Best alternative sentence should be returned', () => {
  const sentences = {
    alternatives: [
      {
        'transcript': 'this is the first sentence',
        'confidence': 0.95,
      },
      {
        'transcript': 'this is the first sentence alternative',
        'confidence': 0.80,
      }
    ]
  };
  const expected = {
    'transcript': 'this is the first sentence',
    'confidence': 0.95
  };

  it('Should be equal to expected value', () => {

    const result = getBestAlternativeSentence(sentences);
    expect(result).toEqual(expected);
  });
});
