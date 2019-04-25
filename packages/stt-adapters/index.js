import bbcKaldiToDraft from './bbc-kaldi/index';
import autoEdit2ToDraft from './autoEdit2/index';
import speechmaticsToDraft from './speechmatics/index';
import amazonTranscribeToDraft from './amazon-transcribe/index';
import ibmToDraft from './ibm/index';
import digitalPaperEditToDraft from './digital-paper-edit/index';
import createEntityMap from './create-entity-map/index';

/**
 * Adapters for STT conversion
 * @param {json} transcriptData - A json transcript with some word accurate timecode
 * @param {string} sttJsonType - the type of transcript supported by the available adapters
 */
const sttJsonAdapter = (transcriptData, sttJsonType) => {
  let blocks;
  switch (sttJsonType) {
  case 'bbckaldi':
    blocks = bbcKaldiToDraft(transcriptData);

    return { blocks, entityMap: createEntityMap(blocks) };
  case 'autoedit2':
    blocks = autoEdit2ToDraft(transcriptData);

    return { blocks, entityMap: createEntityMap(blocks) };
  case 'speechmatics':
    blocks = speechmaticsToDraft(transcriptData);

    return { blocks, entityMap: createEntityMap(blocks) };
  case 'ibm':
    blocks = ibmToDraft(transcriptData);

    return { blocks, entityMap: createEntityMap(blocks) };
  case 'draftjs':
    return transcriptData; // (typeof transcriptData === 'string')? JSON.parse(transcriptData): transcriptData;

  case 'amazontranscribe':
    blocks = amazonTranscribeToDraft(transcriptData);

    return { blocks, entityMap: createEntityMap(blocks) };
  case 'digitalpaperedit':
    blocks = digitalPaperEditToDraft(transcriptData);

    return { blocks, entityMap: createEntityMap(blocks) };
  default:
    // code block
    console.error('Did not recognize the stt engine.');
  }
};

export default sttJsonAdapter;
