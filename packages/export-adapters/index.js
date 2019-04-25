import draftToTxt from './txt/index';
import draftToDigitalPaperEdit from './draftjs-to-digital-paper-edit/index.js';
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
  case 'digitalpaperedit':
    return { data: JSON.stringify(draftToDigitalPaperEdit(blockData), null, 2), ext: 'json' };
  default:
    // code block
    console.error('Did not recognise the export format');
  }
};

export default exportAdapter;
