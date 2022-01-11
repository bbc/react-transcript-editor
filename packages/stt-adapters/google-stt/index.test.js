import gcpSttToDraft, {
  getBestAlternativeSentence,
  trimLeadingAndTailingWhiteSpace
} from './index';
import draftTranscriptSample from './sample/googleSttToDraftJs.sample.js';
import gcpSttTedTalkTranscript from './sample/gcpSttPunctuation.sample.json';
import gcpSttTedTalkTranscript2022 from './sample/gcpStt2022.sample.json';

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

describe('start and end should be computed properly for newer transcription format', () => {
  const result = gcpSttToDraft(gcpSttTedTalkTranscript2022);
  it('Should be defined', () => {
    expect(result).toBeDefined();
  });

  it('Should be equal to expected value', () => {
    const expected = {
      'confidence': 0.96094823,
      'end': 13.3,
      'start': 12.9,
      'text': 'there'
    };

    expect(result[0].data.words[0]).toEqual(expected);
  });
});
