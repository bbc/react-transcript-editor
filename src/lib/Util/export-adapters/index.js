import draftToTxt from './txt/index';
import draftToDocx from './docx/index';
/**
 * Adapters for Draft.js conversion
 * @param {json} blockData - Draft.js blocks
 * @param {string} exportFormat - the type of file supported by the available adapters
 */

const exportAdapter = (blockData, exportFormat) => {
  switch (exportFormat) {
  case 'draftjs':
    return { data: JSON.stringify(blockData, null, 2), ext: 'json' };
  case 'txt':
    return { data: draftToTxt(blockData), ext: 'txt' };
    case 'docx':
    return { data: draftToDocx(blockData), ext: 'docx' };
  default:
    // code block
    console.error('Did not recognise the export format');
  }
};

export default exportAdapter;
