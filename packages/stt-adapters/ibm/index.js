/**
 * Convert IBM json to draftJS
 * see `sample` folder for example of input and output as well as `example-usage.js`
 *
 */
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
    const draftJsParagraphsResults = [];
    ibmNormalisedWordsWithSpeakers.forEach((ibmParagraph) => {
      const draftJsContentBlockParagraph = {
        text: ibmParagraph.map((word) => {return word.text;}).join(' '),
        type: 'paragraph',
        data: {
          // Assuming each paragraph in IBM line is the same
          // for context it just seems like the IBM data structure gives you word level speakers,
          // but also gives you "lines" so assuming each word in a line has the same speaker.
          speaker: ibmParagraph[0].speaker,
          words: ibmParagraph,
          start: ibmParagraph[0].start
        },
        // the entities as ranges are each word in the space-joined text,
        // so it needs to be compute for each the offset from the beginning of the paragraph and the length
        entityRanges: generateEntitiesRanges(ibmParagraph, 'text'), // wordAttributeName
      };
      draftJsParagraphsResults.push(draftJsContentBlockParagraph);
    });

    return draftJsParagraphsResults;
  };

  const normalisedWords = normalizeIBMWordsList(ibmJson.results[0].results);
  // TODO: nested array of words, to keep some sort of paragraphs, in case there's only one speaker
  // can be refactored/optimised later
  const ibmNormalisedWordsWithSpeakers = addSpeakersToWords(normalisedWords, ibmJson.results[0].speaker_labels);
  const ibmDratJs = ibmNormalisedWordsToDraftJs(ibmNormalisedWordsWithSpeakers);

  return ibmDratJs;
};

export default ibmToDraft;
