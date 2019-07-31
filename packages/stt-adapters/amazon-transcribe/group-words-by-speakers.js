export const groupWordsBySpeakerLabel = (words) => {
  const groupedWords = [];
  let currentSpeaker = '';
  words.forEach((word) => {
    if (word.speaker_label === currentSpeaker) {
      groupedWords[groupedWords.length - 1].words.push(word);
    } else {
      currentSpeaker = word.speaker_label;
      // start new speaker block
      groupedWords.push({
        speaker: word.speaker_label,
        words: [ word ] });
    }
  });

  return groupedWords;
};

export const findSpeakerForWord = (word, segments) => {
  const startTime = parseFloat(word.start_time);
  const endTime = parseFloat(word.end_time);
  const firstMatchingSegment = segments.find((seg) => {
    return startTime >= parseFloat(seg.start_time) && endTime <= parseFloat(seg.end_time);
  });
  if (firstMatchingSegment === undefined) {
    return 'UKN';
  } else {
    return firstMatchingSegment.speaker_label.replace('spk_', '');
  }
};

const addSpeakerLabelToWords = (words, segments) => {
  return words.map(w => Object.assign(w, { 'speaker_label': findSpeakerForWord(w, segments) }));
};

export const groupWordsBySpeaker = (words, speakerLabels) => {
  const wordsWithSpeakers = addSpeakerLabelToWords(words, speakerLabels.segments);

  return groupWordsBySpeakerLabel(wordsWithSpeakers);
};