/**
edge cases
- more segments then words - not an issue if you start by matching words with segment
and handle edge case where it doesn't find a match
- more words then segments - orphan words
 */
function groupWordsInParagraphsBySpeakers(words, segments) {
  // add speakers to each word
  const wordsWithSpeakers = addSpeakerToEachWord(words, segments.segments);
  // group words by speakers sequentially
  const result = groupWordsBySpeaker(wordsWithSpeakers);

  return result;
};

/**
* Add speakers to each words
* if it doesn't have add unknown attribute `U_UKN`
* @param {*} words
* @param {*} segments
*/
function addSpeakerToEachWord(words, segments) {
  const tmpWordsWithSpeakers = [];
  words.forEach((word) => {
    const tmpSpeakerSegment = findSegmentForWord(word, segments);

    word.speaker = formatSpeakerName(tmpSpeakerSegment.speaker);
    tmpWordsWithSpeakers.push(word);
  });

  return tmpWordsWithSpeakers;
}

/**
 * Groups Words by speaker attribute
 * @param {array} wordsWithSpeakers - same as kaldi words list but with a `speaker` label attribute on each word
 * @return {array} - list of paragraph objcts, with words, text and sepaker attributes.
 * where words is an array and the other two are strings.
 */
function groupWordsBySpeaker(wordsWithSpeakers) {
  let currentSpeaker = wordsWithSpeakers[0].speaker;
  const results = [ ];
  let paragraph = { words: [], text: '', speaker: '' };
  wordsWithSpeakers.forEach((word) => {
    // if current speaker same as word speaker add words to paragraph
    if (currentSpeaker === word.speaker) {
      paragraph.words.push(word);
      paragraph.text += word.punct + ' ';
      paragraph.speaker = currentSpeaker;
    }
    // if it's not same speaker
    else {
      // update current speaker
      currentSpeaker = word.speaker;
      // remove spacing in text
      paragraph.text = paragraph.text.trim();
      //save  previous paragraph
      results.push(paragraph);
      // reset paragraph
      paragraph = { words: [], text: '', speaker: 'U_UKN' };
      // add words attributes to new
      paragraph.words.push(word);
      paragraph.text += word.punct + ' ';
    }
  });
  // add last paragraph
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
    const segEnd = seg.start + seg.duration;

    return ((word.start >= seg.start) && (word.end <= segEnd));
  });
  // if find doesn't find any matches it returns an undefined
  if (tmpSegment === undefined) {
    // covering edge case orphan word not belonging to any segments
    // adding UKN speaker label
    return {
      '@type': 'Segment',
      // keeping both speaker id and gender as this is used later
      // to format speaker label combining the two
      speaker: { '@id': 'UKN', gender: 'U' }
    };
  } else {
    // find returns the first element that matches the criteria
    return tmpSegment;
  }
}

/**
* formats kaldi speaker object into a string
* Combining Gender and speaker Id
* @param {object} speaker - BBC kaldi speaker object
* @return {string} -
*/
function formatSpeakerName(speaker) {
  return speaker.gender + '_' + speaker['@id'];
}

export default groupWordsInParagraphsBySpeakers;