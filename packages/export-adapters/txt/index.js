/**
 * Convert DraftJS to plain text without timecodes or speaker names
 */
export default (blockData) => {
  const lines = blockData.blocks.map(x => x.text);

  return lines.join('\n\n');
};
