import amazonTranscribeToDraft, {
  mapPunctuationItemsToWords,
  stripLeadingSpace,
  appendPunctuationToPreviousWord,
  getBestAlternativeForWord
} from './index';
import draftTranscriptSample from './sample/amazonTranscribe.sample.js';
import amazonTranscribeTedTalkTranscript from './sample/amazonTranscribe.sample.json';

describe('amazonTranscribeToDraft', () => {
  const result = amazonTranscribeToDraft(amazonTranscribeTedTalkTranscript);
  it('Should be defined', () => {
    expect(result).toBeDefined();
  });

  it('Should be equal to expected value', () => {
    expect(result).toEqual(draftTranscriptSample);
  });
});

describe('punctuation line item should be added to previous word and return a new array without that item', () => {
  const startWords = [ {
    'start_time': '18.72',
    'end_time': '19.16',
    'alternatives': [ {
      'confidence': '0.9993',
      'content': 'upside'
    } ],
    'type': 'pronunciation'
  },
  {
    'start_time': '19.16',
    'end_time': '19.55',
    'alternatives': [ {
      'confidence': '1.0000',
      'content': 'down'
    } ],
    'type': 'pronunciation'
  },
  {
    'alternatives': [ {
      'confidence': null,
      'content': '.'
    } ],
    'type': 'punctuation'
  }
  ];

  const expected = [ {
    'start_time': '18.72',
    'end_time': '19.16',
    'alternatives': [ {
      'confidence': '0.9993',
      'content': 'upside'
    } ],
    'type': 'pronunciation'
  },
  {
    'start_time': '19.16',
    'end_time': '19.55',
    'alternatives': [ {
      'confidence': '1.0000',
      'content': 'down.'
    } ],
    'type': 'pronunciation'
  }
  ];

  const result = mapPunctuationItemsToWords(startWords);
  it('should be equal to expected value', () => {
    expect(result).toEqual(expected);
  });
});

describe('Best alternative for word should be returned', () => {
  const startWord = {
    'start_time': '18.72',
    'end_time': '19.16',
    'alternatives': [ {
      'confidence': '0.9993',
      'content': 'upside'
    },
    {
      'confidence': '0.88',
      'content': 'topside'
    }
    ],
    'type': 'pronunciation'
  };
  const expected = {
    'confidence': '0.9993',
    'content': 'upside'
  };
  it('Should be equal to expected value', () => {

    const result = getBestAlternativeForWord(startWord);
    expect(result).toEqual(expected);
  });
});

describe('Leading space should be removed from punctuation item', () => {
  const startWord = ' , ';
  const expected = ', ';
  it('should be equal to expected value', () => {
    const result = stripLeadingSpace(startWord);
    expect(result).toEqual(expected);
  });
});

describe('a word item and punctuation item should be merged', () => {
  const startWord = {
    'start_time': '19.16',
    'end_time': '19.55',
    'alternatives': [ {
      'confidence': '1.0000',
      'content': 'down'
    } ],
    'type': 'pronunciation'
  };
  const startPunctuation = {
    'alternatives': [ {
      'confidence': null,
      'content': ' . '
    } ],
    'type': 'punctuation'
  };
  const expected = {
    'start_time': '19.16',
    'end_time': '19.55',
    'alternatives': [ {
      'confidence': '1.0000',
      'content': 'down. '
    } ],
    'type': 'pronunciation'
  };
  it('should be equal to expected value', () => {
    const result = appendPunctuationToPreviousWord(startPunctuation, startWord);
    expect(result).toEqual(expected);
  });
});
