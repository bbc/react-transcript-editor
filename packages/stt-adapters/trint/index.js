import generateEntitiesRanges from '../generate-entities-ranges/index.js';

const normalizeWord = currentWord => {
    const start = currentWord.time / 1000;
    const end = (currentWord.time + currentWord.duration) / 1000;
    return {
        start,
        end,
        text: currentWord.value,
        confidence: 1
    };
};

const groupWordsInParagraphs = words => {
    const results = [];
    let paragraph = {
        words: [],
        text: []
    };
    words.forEach((word) => {
        const content = word.value;
        const normalizedWord = normalizeWord(word);
        if (/[.?!]/.test(content)) {
            paragraph.words.push(normalizedWord);
            paragraph.text.push(content);
            results.push(paragraph);
            // reset paragraph
            paragraph = { words: [], text: [] };
        } else {
            paragraph.words.push(normalizedWord);
            paragraph.text.push(content);
        }
    });
    return results;
}

const trintToDraft = trintJson => {
    const results = [];
    const tmpWords = trintJson.words;
    const wordsByParagraphs = groupWordsInParagraphs(tmpWords)
    wordsByParagraphs.forEach((paragraph, i) => {
        const draftJsContentBlockParagraph = {
            text: paragraph.text.join(' '),
            type: 'paragraph',
            data: {
                speaker: `TBC ${i}`,
                words: paragraph.words,
                start: paragraph.words[0].start
            },
            // the entities as ranges are each word in the space-joined text,
            // so it needs to be compute for each the offset from the beginning of the paragraph and the length
            entityRanges: generateEntitiesRanges(paragraph.words, 'text') // wordAttributeName
        };
        results.push(draftJsContentBlockParagraph);
    });
    return results;
}

export default trintToDraft