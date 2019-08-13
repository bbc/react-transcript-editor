import { Document, Paragraph, TextRun, Packer } from 'docx';
import { shortTimecode } from '../../util/timecode-converter/';

export default (blockData, transcriptTitle) => {
  // const lines = blockData.blocks.map(x => x.text);

  return generateDocxFromDraftJs(blockData, transcriptTitle);
  // return lines.join('\n\n');
};

function generateDocxFromDraftJs(blockData, transcriptTitle) {

  const doc = new Document({
    creator: 'Test',
    description: 'Test Description',
    title: transcriptTitle,
  });

  // Transcript Title
  // TODO: get title in programmatically - optional value
  const textTitle = new TextRun(transcriptTitle);
  const paragraphTitle = new Paragraph();
  paragraphTitle.addRun(textTitle);
  paragraphTitle.heading1().center();
  doc.addParagraph(paragraphTitle);

  // add spacing
  var paragraphEmpty = new Paragraph();
  doc.addParagraph(paragraphEmpty);

  blockData.blocks.forEach((draftJsParagraph) => {
    // TODO: use timecode converter module to convert from seconds to timecode
    const paragraphSpeakerTimecodes = new Paragraph(shortTimecode(draftJsParagraph.data.words[0].start));
    const speaker = new TextRun(draftJsParagraph.data.speaker).bold().tab();
    const textBreak = new TextRun('').break();
    paragraphSpeakerTimecodes.addRun(speaker);
    doc.addParagraph(paragraphSpeakerTimecodes);
    const paragraphText = new Paragraph(draftJsParagraph.text);
    paragraphText.addRun(textBreak);
    doc.addParagraph(paragraphText);
  });

  const packer = new Packer();

  packer.toBlob(doc).then(blob => {
    const filename = `${ transcriptTitle }.docx`;
    // // const type =  'application/octet-stream';
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();

    return blob;
  });

}