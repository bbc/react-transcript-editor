/**
 * Helper function to generate draft.js entityMap from draftJS blocks,
 */

/**
 * helper function to flatten a list.
 * converts nested arrays into one dimensional array
 * @param {array} list
 */
const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

/**
 * helper function to create createEntityMap
 * @param {*} blocks - draftJs blocks
 */
const createEntityMap = (blocks) => {
  const entityRanges = blocks.map(block => block.entityRanges);
  const flatEntityRanges = flatten(entityRanges);

  const entityMap = {};

  flatEntityRanges.forEach((data) => {
    entityMap[data.key] = {
      type: 'WORD',
      mutability: 'MUTABLE',
      data,
    };
  });

  return entityMap;
};

export default createEntityMap;