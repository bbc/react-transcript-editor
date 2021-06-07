import convert from './index.js';
import sampleJson from './sample/assembly_example.json';

const json = convert(sampleJson);

console.log(json);