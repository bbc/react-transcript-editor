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
///////////////
import generateEntitiesRanges from '../generate-entities-ranges/index.js';

const ibmToDraft = ibmJson => {
  // helper function to normalise IBM words at line level
  const normalizeTimeStampsToWords = timestamps => {
    return timestamps.map(ibmWord => {
      return {
        text: ibmWord[0],
        start: ibmWord[1],
        end: ibmWord[2]
      };
    });
  };

  //
  const normalizeIBMWordsList = ibmResults => {
    const normalisedResults = [];
    ibmResults.forEach(result => {
      // nested array to keep paragraph segmentation same as IBM lines
      normalisedResults.push(normalizeTimeStampsToWords(result.alternatives[0].timestamps));
      // TODO: can be revisited - as separate PR by flattening the array like this
      // normalisedResults = normalisedResults.concact(normalizeTimeStampsToWords(result.alternatives[0].timestamps));
      // addSpeakersToWords function would need adjusting as would be dealing with a 1D array instead of 2D
      // if edge case, like in example file, that there's one speaker recognised through all of speaker segemtnation info
      // could break into paragraph when is over a minute? at end of IBM line?
      // or punctuation, altho IBM does not seem to provide punctuation?
    });

    return normalisedResults;
  };

  // TODO: could be separate file
  const findSpeakerSegmentForWord = (word, speakerSegments) => {
    const tmpSegment = speakerSegments.find(seg => {
      const segStart = seg.from;
      const segEnd = seg.to;

      return ((word.start === segStart) && (word.end === segEnd));
    });
    // if find doesn't find any matches it returns an undefined
    if (tmpSegment === undefined) {
      // covering edge case orphan word not belonging to any segments
      // adding UKN speaker label
      return 'UKN';
    } else {
      // find returns the first element that matches the criteria
      return `S_${ tmpSegment.speaker }`;
    }
  };
  // add speakers to words
  const addSpeakersToWords = (ibmWords, ibmSpeakers) => {
    return ibmWords.map(lines => {
      return lines.map(word => {

        word.speaker = findSpeakerSegmentForWord(word, ibmSpeakers);

        return word;
      });
    });
  };

  const ibmNormalisedWordsToDraftJs = (ibmNormalisedWordsWithSpeakers) => {
    const drafJsParagraphsResults = [];
    ibmNormalisedWordsWithSpeakers.forEach((ibmParagraph) => {
      const draftJsContentBlockParagraph = {
        text: ibmParagraph.map((word) => {return word.text;}).join(' '),
        type: 'paragraph',
        data: {
          // TODO: Assuming each paragraph in IBM line is the same
          speaker: ibmParagraph[0].speaker,
          words: ibmParagraph,
          start: ibmParagraph[0].start
        },
        // the entities as ranges are each word in the space-joined text,
        // so it needs to be compute for each the offset from the beginning of the paragraph and the length
        entityRanges: generateEntitiesRanges(ibmParagraph, 'text'), // wordAttributeName
      };
      drafJsParagraphsResults.push(draftJsContentBlockParagraph);
    });

    return drafJsParagraphsResults;
  };

  const normalisedWords = normalizeIBMWordsList(ibmJson.results[0].results);
  // nested array of words, to keep some sort of paragraphs, in case there's only one speaker
  // can be refactored/optimised later
  const ibmNormalisedWordsWithSpeakers = addSpeakersToWords(normalisedWords, ibmJson.results[0].speaker_labels);
  const ibmDratJs = ibmNormalisedWordsToDraftJs(ibmNormalisedWordsWithSpeakers);

  return ibmDratJs;
};

export default ibmToDraft;
