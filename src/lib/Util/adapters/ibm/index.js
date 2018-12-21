/**
 * Convert IBM json
 ```
 {
   "created": "2018-12-18T22:40:38.903Z",
   "id": "f14cbe1e-0315-11e9-b590-a3e1e3acdd73",
   "updated": "2018-12-18T22:47:30.392Z",
   "results": [{
      "result_index": 0,
      "speaker_labels": [
         {
            "speaker": 1,
            "confidence": 0.36,
            "final": false,
            "from": 13.04,
            "to": 13.23
         }, ...]
      "results": [
         {
            "final": true,
            "alternatives": [{
               "transcript": "there is a day about ten years ago when I asked a friend to hold a baby dinosaur robot upside down ",
               "timestamps": [
                  [
                     "there",
                     13.04,
                     13.23
                  ],
                  [
                     "is",
                     13.23,
                     13.36
                  ] ...

               "confidence": 0.938,
               "word_confidence": [
                  [
                     "there",
                     0.902
                  ],
                  [
                     "is",
                     0.52
                  ],
                  [
                     "a",
                     0.819
                  ] ...
        ...
```
 *
 * into
 *
 ```
 const blocks = [
  {
    "text": "There is a day.",
    "type": "paragraph",
    "data": {
      "speaker": "TBC 0",
      "words": [
        {
          "start": 13.02,
          "confidence": 0.68,
          "end": 13.17,
          "word": "there",
          "punct": "There",
          "index": 0
        },
        {
          "start": 13.17,
          "confidence": 0.61,
          "end": 13.38,
          "word": "is",
          "punct": "is",
          "index": 1
        },
        {
          "start": 13.38,
          "confidence": 0.99,
          "end": 13.44,
          "word": "a",
          "punct": "a",
          "index": 2
        },
        {
          "start": 13.44,
          "confidence": 1,
          "end": 13.86,
          "word": "day",
          "punct": "day.",
          "index": 3
        }
      ],
      "start": 13.02
    },
    "entityRanges": [
      {
        "start": 13.02,
        "end": 13.17,
        "confidence": 0.68,
        "text": "There",
        "offset": 0,
        "length": 5,
        "key": "li6c6ld"
      },
      {
        "start": 13.17,
        "end": 13.38,
        "confidence": 0.61,
        "text": "is",
        "offset": 6,
        "length": 2,
        "key": "pcgzkp6"
      },
      {
        "start": 13.38,
        "end": 13.44,
        "confidence": 0.99,
        "text": "a",
        "offset": 9,
        "length": 1,
        "key": "ngomd9"
      },
      {
        "start": 13.44,
        "end": 13.86,
        "confidence": 1,
        "text": "day.",
        "offset": 11,
        "length": 4,
        "key": "sgmfl4f"
      }
    ]
  },
  ...
```
 *
 */

const ibmToDraft = (ibmJson) => {

  let x, y, z, topLvlResult, result;

  const addPunctuation = true;
  let newSentence = true;
  let firstWordOfSentence = null;
  let punctuatedWord = null;

  // Watson doesn't include punctuation at this time (Dec-2018).
  // Instead, manually capitalize first word after a "final" transcript block.
  function capitalizeFirstLetter(string) {
    if (!addPunctuation) {
      return string;
    } else {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  // Watson doesn't include punctuation at this time (Dec-2018).
  // Instead, manually add punctuation on last word of "final" transcript blocks.
  function punctuateEndOfSentence(firstWord, lastWord) {
    if (!addPunctuation) {
      return lastWord;

    } else {

      const interrogatives = [ 'when', 'where', 'why', 'how', 'does', "doesn't" ];

      if (interrogatives.includes(firstWord)) {

        return lastWord + '?';

      } else {

        return lastWord + '.';

      }
    }
  }

  const results = [];
  for (x = 0; x < ibmJson.results.length; x++) { // result top level

    topLvlResult = ibmJson.results[x];

    for (y = 0; y < topLvlResult.results.length; y++) { // sentence level

      const block = {};
      const data = {};
      const words = [];
      const entityRanges = [];
      const sentenceArray = [];
      let offset = 0;

      result = topLvlResult.results[y];

      for (z = 0; z < result.alternatives[0].timestamps.length; z++) { // word level

        const word = result.alternatives[0].timestamps[z][0];
        const startTime = result.alternatives[0].timestamps[z][1];
        const endTime = result.alternatives[0].timestamps[z][2];
        const wordConfidence = result.alternatives[0].hasOwnProperty('word_confidence') ?
          result.alternatives[0].word_confidence[z][1] : 100;

        if (newSentence === true) {
          punctuatedWord = capitalizeFirstLetter(word);
          firstWordOfSentence = word;
          newSentence = false;
           data.speaker = 'Speaker ' + topLvlResult.speaker_labels[z].speaker;
          data.start = result.alternatives[0].timestamps[z][1];
        } else {
          punctuatedWord = word;
        }

        if ((z + 1) === (result.alternatives[0].timestamps.length) && result.final) { // end of block.
          punctuatedWord = punctuateEndOfSentence(firstWordOfSentence, word);
          newSentence = true;
        }

        const puncWordLength = punctuatedWord.length;

        const aWord = {
          start: startTime,
          confidence: wordConfidence,
          end: endTime,
          word: word,
          punct: punctuatedWord,
          index: z
        };

        const anEntityRange = {
          start: startTime,
          end: endTime,
          confidence: wordConfidence,
          text: punctuatedWord,
          offset: offset,
          length: puncWordLength,
          key: Math.random().toString(36).substring(6)
        };

        offset += puncWordLength + 1;

        words.push(aWord);
        entityRanges.push(anEntityRange);
        sentenceArray.push(punctuatedWord);

      }

      data.words = words;

      block['text'] = sentenceArray.join(' ');
      block['type'] = 'paragraph';
      block['data'] = data;
      block['entityRanges'] = entityRanges;

      results.push(block);

    }

  }

  return results;
};

export default ibmToDraft;
