function groupWordsInParagraphsBySpeakers(words, segments) {
  let segmentIndex = 0;
  const results = [];
  let paragraph = { words: [], text: '', speaker:'' };
  let speaker = _getSpeaker(segments, segmentIndex);
  let currentSpeakerId = speaker.id;
  paragraph.speaker = speaker.gender+'_'+speaker.id;

  words.forEach(word => {
    if (word.start < speaker.end) {
      paragraph.words.push(word);
      paragraph.text += word.punct + ' ';
    } else {
      segmentIndex++;
      speaker = _getSpeaker(segments, segmentIndex);

      if (currentSpeakerId !== speaker.id) {
        paragraph.speaker = speaker.gender+'_'+speaker.id;
        currentSpeakerId = speaker.id;
        paragraph.text = paragraph.text.trim();
        results.push(paragraph);
        paragraph = { words: [], text: '', speaker: '' };
      }
      paragraph.words.push(word);
      paragraph.text += word.punct + ' ';
    //   results.push(paragraph);
    }
  });

  return results;
};

function _getSpeaker(segments, index) {
  const seg = segments.segments[index];

  return {
    start: seg.start,
    end: seg.start + seg.duration,
    id: seg.speaker['@id'],
    gender: seg.speaker.gender
  };
};

export default groupWordsInParagraphsBySpeakers;