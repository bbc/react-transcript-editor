import draftToTxt from './txt/index';
import draftToTxtSpeakersTimecodes from './txt-speakers-timecodes/index';
import draftToDigitalPaperEdit from './draftjs-to-digital-paper-edit/index.js';
import subtitlesGenerator from './subtitles-generator/index.js';
/**
 * Adapters for Draft.js conversion
 * @param {json} blockData - Draft.js blocks
 * @param {string} exportFormat - the type of file supported by the available adapters
 */

const exportAdapter = (blockData, exportFormat) => {
  switch (exportFormat) {
  case 'draftjs':
    return { data: blockData, ext: 'json' };
  case 'txt':
    return { data: draftToTxt(blockData), ext: 'txt' };
  case 'txtspeakertimecodes':
    return { data: draftToTxtSpeakersTimecodes(blockData), ext: 'txt' };
  case 'digitalpaperedit':
    return { data: draftToDigitalPaperEdit(blockData), ext: 'json' };
  case 'srt':
    const { words } = draftToDigitalPaperEdit(blockData);
    const srtContent = subtitlesGenerator({ words, type: 'srt', numberOfCharPerLine: 35 });

    return { data: srtContent, ext: 'srt' };
  default:
    // code block
    console.error('Did not recognise the export format');
  }
};

export default exportAdapter;
