export default (blockData) => {
  const lines = blockData.blocks.map(x => x.text);
  return lines.join('\n\n');
};
