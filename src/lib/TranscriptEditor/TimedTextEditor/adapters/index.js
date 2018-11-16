import bbcKaldiToDraft from './bbc-kaldi/index.js';
import autoEdit2ToDraft from './autoEdit2/index.js';
/**
 * Adapters for STT conversion
 * @param {json} transcriptData - A json transcript with some word accurate timecode
 * @param {string} sttJsonType - the type of transcript supported by the available adapters
 */
const sttJsonAdapter = (transcriptData, sttJsonType) => {
    switch(sttJsonType) {
        case 'bbckaldi':
            return bbcKaldiToDraft(transcriptData);
        case 'autoedit2':
            return autoEdit2ToDraft(transcriptData);
        case 'draftjs':
            return transcriptData.blocks; // (typeof transcriptData === 'string')? JSON.parse(transcriptData): transcriptData;
        default:
            // code block
            console.error('not recognised the stt enginge');
    }
}

export default sttJsonAdapter;