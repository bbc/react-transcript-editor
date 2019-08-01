import fs from 'fs';
import alignWords from './stt-align-node.js';
import { words } from './sample/NathanielGleicher-aws-dpe.sample.json';
import text from './sample/The Facebook Dilemma - Nathaniel Gleicher-F0ykdaOck_M.en.txt.sample.js';

function splitWords(text) {
  return text
    .trim()
    .replace(/\n /g, '')
    .replace(/\n/g, ' ')
    .split(' ');
}

const transcriptWords = splitWords(text);

const sttWords = words.map((word) => {
  word.word = word.text;

  return word;
});

const result = alignWords(sttWords, transcriptWords);

// console.log(result);
fs.writeFileSync('./packages/components/timed-text-editor/UpdateTimestamps/sample/alignement-result.sample.json', JSON.stringify(result, null, 2));