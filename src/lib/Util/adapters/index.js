import bbcKaldiToDraft from './bbc-kaldi/index';
import autoEdit2ToDraft from './autoEdit2/index';
import speechmaticsToDraft from './speechmatics/index';
/**
 * Adapters for STT conversion
 * @param {json} transcriptData - A json transcript with some word accurate timecode
 * @param {string} sttJsonType - the type of transcript supported by the available adapters
 */

// converts nested arrays into one dimensional array
const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

const createEntityMap = (blocks) => {
  const entityRanges = blocks.map(block => block.entityRanges);
  // eslint-disable-next-line no-use-before-define
  const flatEntityRanges = flatten(entityRanges);

  const entityMap = {};

  flatEntityRanges.forEach((data) => {
    entityMap[data.key] = {
      type: 'WORD',
      mutability: 'MUTABLE',
      data,
    };
  });

  return entityMap;
};

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
  case 'draftjs':
    return transcriptData; // (typeof transcriptData === 'string')? JSON.parse(transcriptData): transcriptData;
  default:
    // code block
    console.error('not recognised the stt enginge');
  }
};

export default sttJsonAdapter;
