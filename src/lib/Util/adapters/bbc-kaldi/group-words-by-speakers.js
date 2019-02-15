/**
edge cases
- more segments then words - not an issue if you start by matching words with segment
and handle edge case where it doesn't find a match
- more words then segments - orphan words
 */
function groupWordsInParagraphsBySpeakers(words, segments) {
  let uknownSpeakerLabel = 'U_UKN';
  let results = [ ];
  // add speakers to each word
  let wordsWithSpeakers = addSpeakerToEachWord(words, segments.segments);
  let currentSpeaker = '';
  // group words by speakers sequentally
  currentSpeaker = wordsWithSpeakers[0].speaker;
  let paragraph = { words: [], text: '', speaker:'' };

  wordsWithSpeakers.forEach((word) => {
    // if current speaker same as word speaker add words to paragraph
    if (currentSpeaker === word.speaker) {
      paragraph.words.push(word);
      paragraph.text += word.punct+' ';
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
      paragraph = { words: [], text: '', speaker: uknownSpeakerLabel };
      // add words attributes to new
      paragraph.words.push(word);
      paragraph.text += word.punct+' ';
    }
  });
  // add last paragraph
  results.push(paragraph);

  return results;
};

/**
* Add speakers to each words
* if it doesn't have add uknw
* @param {*} words
* @param {*} semgnets
*/
function addSpeakerToEachWord(words, segments) {
  let tmpwordsWithSpeakers =[];
  words.forEach((word) => {
    let tmpSpeakerSegment = findSegmentForWord(word, segments);

    word.speaker = _formatSpeakerName(tmpSpeakerSegment.speaker);
    tmpwordsWithSpeakers.push(word);
  });

  return tmpwordsWithSpeakers;
}

/**
* Helper funcitons
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
    let segEnd = seg.start + seg.duration;

    return ((word.start >= seg.start) && (word.end <= segEnd));
    // return word.end  <= segEnd;
  });
  // if find doesn't find any matches it returns an undefined
  if (tmpSegment === undefined) {
    // covering edge case orphan word not belonging to any segments
    // adding UKN speaker label
    return {
      '@type': 'Segment',
      // start: 13.01,
      // duration: 6.75,
      // bandwidth: 'S',
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
function _formatSpeakerName(speaker) {
  return speaker.gender+'_'+speaker['@id'];
}

export default groupWordsInParagraphsBySpeakers;