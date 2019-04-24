// import ibmToDraft from './index.js';
// import ibmTedTalkTranscript from './sample/ibmTedTalkTranscript.sample.json';

// const result = ibmToDraft(ibmTedTalkTranscript);

// console.log(JSON.stringify(result, null, 2));

const draftJs = require('./sample/draftJs.sample.json');

const result = {words: [], paragraphs: []};

 draftJs.blocks.forEach((block, index)=>{

     if(block.data.words !== undefined){
         // TODO: make sure that when restoring timecodes text attribute in block word data
        // should be updated as well
        const tmpParagraph = { 
            id: index,
            start: block.data.words[0].start, //block.data.start,
            end: block.data.words[ block.data.words.length-1].end,
            speaker: block.data.speaker
        }
        result.paragraphs.push(tmpParagraph);
        // using data within a block to get words info
        const tmpWords = block.data.words.map((word)=>{
            const tmpWord = {
                id: word.index,
                start: word.start,
                end: word.end,
                // text: word.text
            }
            // TODO: need to normalise various stt adapters 
            // so that when they create draftJs json, word text attribute
            // has got consistent naming. `text` and not `punct` or `word`.
            if(word.text){
                tmpWord.text = word.punct;
            }
            else if(word.punct){
                tmpWord.text = word.punct;
            }
            else if(word.word){
                tmpWord.text = word.punct;
            }
            return tmpWord;
        })
        result.words.push(tmpWords);
     }
    // return result;
});

console.log(JSON.stringify(result,null,2));