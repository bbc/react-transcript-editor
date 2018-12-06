import draftToIFR from './ifr-running-order/index';
import draftToTxt from './txt/index';
/**
 * Adapters for Draft.js conversion
 * @param {json} blockData - Draft.js blocks
 * @param {string} exportFormat - the type of file supported by the available adapters
 */

const exportAdapter = (blockData, exportFormat) => {
  switch (exportFormat) {
    case 'draftjs':
      return { data: JSON.stringify(blockData), ext: 'json' };
    case 'txt':
      return { data: draftToTxt(blockData), ext: 'txt' };
    case 'ifr':
      return { data: draftToIFR(blockData), ext: 'json' };
    default:
      // code block
      console.error('Did not recognise the export format');
  }
}

export default exportAdapter;
