// converts nested arrays into one dimensional array
const flatten = list =>
  list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

const createEntityMap = blocks => {
  const entityRanges = blocks.map(block => block.entityRanges);
  // eslint-disable-next-line no-use-before-define
  const flatEntityRanges = flatten(entityRanges);

  const entityMap = {};

  flatEntityRanges.forEach(data => {
    entityMap[data.key] = {
      type: "WORD",
      mutability: "MUTABLE",
      data
    };
  });

  return entityMap;
};

export default createEntityMap;
