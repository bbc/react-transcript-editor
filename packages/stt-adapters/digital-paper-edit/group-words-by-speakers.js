/**
 edge cases
- more segments then words - not an issue if you start by matching words with segment
and handle edge case where it doesn't find a match
- more words then segments - orphan words?
*
* Takes in list of words and list of paragraphs (paragraphs have speakers info associated with it)
```js
{
  "words": [
    {
      "id": 0,
      "start": 13.02,
      "end": 13.17,
      "text": "There"
    },
    {
      "id": 1,
      "start": 13.17,
      "end": 13.38,
      "text": "is"
    },
    ...
    ],
  "paragraphs": [
    {
      "id": 0,
      "start": 13.02,
      "end": 13.86,
      "speaker": "TBC 00"
    },
    {
      "id": 1,
      "start": 13.86,
      "end": 19.58,
      "speaker": "TBC 1"
    },
    ...
  ]
}
```
*  and returns a list of words grouped into paragraphs, with words, text and speaker attribute
```js
[
  {
    "words": [
      {
        "id": 0,
        "start": 13.02,
        "end": 13.17,
        "text": "There"
      },
      {
        "id": 1,
        "start": 13.17,
        "end": 13.38,
        "text": "is"
      },
      {
        "id": 2,
        "start": 13.38,
        "end": 13.44,
        "text": "a"
      },
      {
        "id": 3,
        "start": 13.44,
        "end": 13.86,
        "text": "day."
      }
    ],
    "text": "There is a day.",
    "speaker": "TBC 00"
  },
  ...
]
```
 */
function groupWordsInParagraphsBySpeakers(words, segments) {
  const result = addWordsToSpeakersParagraphs(words, segments);

  return result;
};

function addWordsToSpeakersParagraphs (words, segments) {
  const results = [];
  let currentSegment = 'UKN';
  let currentSegmentIndex = 0;
  let previousSegmentIndex = 0;
  let paragraph = { words: [], text: '', speaker: '' };
  words.forEach((word) => {
    currentSegment = findSegmentForWord(word, segments);
    // if a segment exists for the word
    if (currentSegment) {
      currentSegmentIndex = segments.indexOf(currentSegment);
      if (currentSegmentIndex === previousSegmentIndex) {
        paragraph.words.push(word);
        paragraph.text += word.text + ' ';
        paragraph.speaker = currentSegment.speaker;
      }
      else {
        previousSegmentIndex = currentSegmentIndex;
        paragraph.text.trim();
        results.push(paragraph);
        paragraph = { words: [], text: '', speaker: '' };
        paragraph.words.push(word);
        paragraph.text += word.text + ' ';
        paragraph.speaker = currentSegment.speaker;
      }
    }
  });
  results.push(paragraph);

  return results;
}

/**
* Helper functions
*/

/**
* given word start and end time attributes
* looks for segment range that contains that word
* if it doesn't find any it returns a segment with `UKN`
* speaker attributes.
* @param {object} word - word object
* @param {array} segments - list of segments objects
* @return {object} - a single segment whose range contains the word
*/
function findSegmentForWord(word, segments) {

  const tmpSegment = segments.find((seg) => {
    if ((word.start >= seg.start) && (word.end <= seg.end)) {
      return seg;
    }
  });

  return tmpSegment;
}

export default groupWordsInParagraphsBySpeakers;