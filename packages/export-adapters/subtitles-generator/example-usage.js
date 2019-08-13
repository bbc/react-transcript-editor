import fs from 'fs';
import subtitlesGenerator from './index.js';
// import transcript from './sample/words-list.sample.json';
import transcript from './sample/words-list-2.sample.json';
const sampleWords = transcript.words;

function getTextFromWordsList(words) {
  return words.map((word) => {return word.text;}).join(' ');
}

const plainText = getTextFromWordsList(sampleWords);

const subtitlesJson = subtitlesGenerator({ words: sampleWords, type: 'json' });
// const ttmlPremiere = subtitlesGenerator({ words: sampleWords, type: 'premiere' });
// const ittData = subtitlesGenerator({ words: sampleWords, type: 'itt' });
// const ttmlData = subtitlesGenerator({ words: sampleWords, type: 'ttml' });
// const srtData = subtitlesGenerator({ words: sampleWords, type: 'srt', numberOfCharPerLine: 35 });
// const vttData = subtitlesGenerator({ words: sampleWords, type: 'vtt' });
// const csvData = subtitlesGenerator({ words: sampleWords, type: 'csv' });
// const preSegmentTextData = subtitlesGenerator({ words: sampleWords, type: 'pre-segment-txt' });
// const testTet = subtitlesGenerator({ words: plainText, type: 'txt' });

console.log(subtitlesJson);

// fs.writeFileSync('./example-output/test.json', JSON.stringify(subtitlesJson, null, 2));
// fs.writeFileSync('./example-output/test-premiere.xml', ttmlPremiere);
// fs.writeFileSync('./example-output/test.itt', ittData);
// fs.writeFileSync('./example-output/test.ttml', ttmlData);
// fs.writeFileSync('./example-output/test.srt', srtData);
// fs.writeFileSync('./example-output/test.vtt', vttData);
// fs.writeFileSync('./example-output/test.csv', csvData);
// fs.writeFileSync('./example-output/test-presegment.txt', preSegmentTextData);
// fs.writeFileSync('./example-output/test.txt', testTet);