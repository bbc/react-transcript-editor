/**
 * Convert DraftJS to plain text with timecodes and speaker names
 */
import { shortTimecode } from '../../util/timecode-converter/index.js';

export default (blockData) => {
  const lines = blockData.blocks.map((block) => {
    return `${ block.data.speaker } \t [${ shortTimecode(block.data.start) }] \t ${ block.text }`;
  });

  return lines.join('\n\n');
};
