import { toWords } from 'number-to-words';
import everpolate from 'everpolate';

function isANumber(num) {
  return !isNaN(num);
}
function removeTrailingPunctuation(str) {
  return str.replace(/\.$/, '');
}

function normaliseWord(wordText) {
  if (wordText) {
    const wordTextResult = wordText.toLowerCase().trim().replace(/[^a-z|0-9|.]+/g, '');
    if (isANumber(wordTextResult)) {
      const sanitizedWord = removeTrailingPunctuation(wordTextResult);
      if (sanitizedWord !== '') {
        return toWords(sanitizedWord);
      }
    }

    return wordTextResult;
  } else {
    return wordText;
  }
}

function interpolationOptimization(wordsList) {
  return wordsList.map((word, index) => {
    let wordTmp = word;
    if (('start' in word) && (index !== 0)) {
      const previousWord = wordsList[index - 1];
      if ('end' in previousWord) {
        wordTmp = {
          start: previousWord.end,
          end: word.end,
          word: word.word
        };
      }
    }
    if (('end' in word) && (index !== (wordsList.length - 1))) {
      const nextWord = wordsList[index + 1];
      if ('start' in nextWord) {
        wordTmp = {
          end: nextWord.start,
          start: word.start,
          word: word.word
        };
      }
    }
    return wordTmp;
  });
}

function adjustTimecodesBoundaries(words) {
  return words.map((word, index, arr) => {
    if (index !== 0) {
      const previousWord = arr[index - 1];
      const currentWord = word;
      if (previousWord.end > currentWord.start) {
        word.start = previousWord.end;
      }
      return word;
    }
    return word;
  });
}

function interpolate(wordsList) {
  const indicies = [...Array(wordsList.length).keys()];
  const indiciesWithStart = [];
  const indiciesWithEnd = [];
  const startTimes = [];
  const endTimes = [];
  wordsList.forEach((word, index) => {
    if ('start' in word) {
      indiciesWithStart.push(index);
      startTimes.push(word.start);
    }

    if ('end' in word) {
      indiciesWithEnd.push(index);
      endTimes.push(word.end);
    }
  });
  const outStartTimes = everpolate.linear(indicies, indiciesWithStart, startTimes);
  const outEndTimes = everpolate.linear(indicies, indiciesWithEnd, endTimes);
  const wordsResults = wordsList.map((word, index) => {
    if (!('start' in word)) {
      word.start = outStartTimes[index];
    }
    if (!('end' in word)) {
      word.end = outEndTimes[index];
    }
    return word;
  });
  return adjustTimecodesBoundaries(wordsResults);
}

function alignWords(sttWords, transcriptWords) {
  const sttWordsStripped = sttWords.map((word) => normaliseWord(word.word));
  const transcriptWordsStripped = transcriptWords.map((word) => normaliseWord(word));

  const transcriptData = transcriptWords.map(() => ({}));

  const matcher = new everpolate.SequenceMatcher(null, sttWordsStripped, transcriptWordsStripped);
  const opCodes = matcher.getOpcodes();

  opCodes.forEach((opCode) => {
    const matchType = opCode[0];
    const sttStartIndex = opCode[1];
    const sttEndIndex = opCode[2];
    const baseTextStartIndex = opCode[3];
    if (matchType === 'equal') {
      const sttDataSegment = sttWords.slice(sttStartIndex, sttEndIndex);
      transcriptData.splice(baseTextStartIndex, sttDataSegment.length, ...sttDataSegment);
    }
    transcriptData.forEach((wordObject, index) => {
      wordObject.word = transcriptWords[index];
    });
  });
  return interpolate(transcriptData);
}

export default alignWords;
