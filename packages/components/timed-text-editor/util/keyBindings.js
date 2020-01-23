import {
  getDefaultKeyBinding,
} from 'draft-js';

/**
 * Listen for draftJs custom key bindings
 */
const customKeyBindingFn = e => {
  const enterKey = 13;
  const spaceKey = 32;
  const kKey = 75;
  const lKey = 76;
  const jKey = 74;
  const equalKey = 187; //used for +
  const minusKey = 189; // -
  const rKey = 82;
  const tKey = 84;

  if (e.keyCode === enterKey) {
    return 'split-paragraph';
  }

  // if alt key is pressed in combination with these other keys
  if (
    e.altKey &&
    (e.keyCode === spaceKey ||
      e.keyCode === spaceKey ||
      e.keyCode === kKey ||
      e.keyCode === lKey ||
      e.keyCode === jKey ||
      e.keyCode === equalKey ||
      e.keyCode === minusKey ||
      e.keyCode === rKey ||
      e.keyCode === tKey)
  ) {
    e.preventDefault();

    return 'keyboard-shortcuts';
  }

  return getDefaultKeyBinding(e);
};

export {
  customKeyBindingFn
};
