import draftToTxt from './txt/index';
import draftToDocx from './docx/index';
import draftToTxtSpeakersTimecodes from './txt-speakers-timecodes/index';
import draftToDigitalPaperEdit from './draftjs-to-digital-paper-edit/index.js';
import subtitlesGenerator from './subtitles-generator/index.js';
/**
 * Adapters for Draft.js conversion
 * @param {json} blockData - Draft.js blocks
 * @param {string} exportFormat - the type of file supported by the available adapters
 */

const exportAdapter = (blockData, exportFormat, transcriptTitle) => {
  switch (exportFormat) {
  case 'draftjs':
    return { data: blockData, ext: 'json' };
  case 'txt':
    return { data: draftToTxt(blockData), ext: 'txt' };
  case 'docx':
    return { data: draftToDocx(blockData, transcriptTitle), ext: 'docx' };
  case 'txtspeakertimecodes':
    return { data: draftToTxtSpeakersTimecodes(blockData), ext: 'txt' };
  case 'digitalpaperedit':
    return { data: draftToDigitalPaperEdit(blockData), ext: 'json' };
  case 'srt':
    var { words } = draftToDigitalPaperEdit(blockData);
    const srtContent = subtitlesGenerator({ words, type: 'srt', numberOfCharPerLine: 35 });

    return { data: srtContent, ext: 'srt' };

  case 'premiereTTML':
    var { words } = draftToDigitalPaperEdit(blockData);
    var content = subtitlesGenerator({ words, type: 'premiere' });

    return { data: content, ext: 'ttml' };
  case 'ttml':
    var { words } = draftToDigitalPaperEdit(blockData);
    var content = subtitlesGenerator({ words, type: 'ttml' });

    return { data: content, ext: 'ttml' };
  case 'itt':
    var { words } = draftToDigitalPaperEdit(blockData);
    var content = subtitlesGenerator({ words, type: 'itt' });

    return { data: content, ext: 'itt' };

  case 'csv':
    var { words } = draftToDigitalPaperEdit(blockData);
    var content = subtitlesGenerator({ words, type: 'csv' });

    return { data: content, ext: 'csv' };
  case 'vtt':
    var { words } = draftToDigitalPaperEdit(blockData);
    var content = subtitlesGenerator({ words, type: 'vtt' });

    return { data: content, ext: 'vtt' };
  case 'json-captions':
    var { words } = draftToDigitalPaperEdit(blockData);
    var content = subtitlesGenerator({ words, type: 'json' });

    return { data: content, ext: 'json' };
  case 'pre-segment-txt':
    var { words } = draftToDigitalPaperEdit(blockData);
    var content = subtitlesGenerator({ words, type: 'pre-segment-txt' });

    return { data: content, ext: 'txt' };
  default:
    // code block
    console.error('Did not recognise the export format');
  }
};

export default exportAdapter;
