import {
  CompositeDecorator,
  getDefaultKeyBinding,
} from 'draft-js';

import Word from './Word';
/**
   * Listen for draftJs custom key bindings
   */
const customKeyBindingFn = (e) => {

  const enterKey = 13;
  const spaceKey = 32;
  const kKey = 75;
  const lKey = 76;
  const jKey = 74;
  const equalKey = 187; //used for +
  const minusKey = 189; // -
  const rKey = 82;
  const tKey = 84;

  if (e.keyCode === enterKey ) {
    return 'split-paragraph';
  }
  // if alt key is pressed in combination with these other keys
  if (e.altKey && ((e.keyCode === spaceKey)
        || (e.keyCode === spaceKey)
        || (e.keyCode === kKey)
        || (e.keyCode === lKey)
        || (e.keyCode === jKey)
        || (e.keyCode === equalKey)
        || (e.keyCode === minusKey)
        || (e.keyCode === rKey)
        || (e.keyCode === tKey))
  ) {
    e.preventDefault();

    return 'keyboard-shortcuts';
  }

  return getDefaultKeyBinding(e);
};

const getEntityStrategy = mutability => {
  const strategy = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
      const entity = character.getEntity();
      if (entity) {
        const entityMutability = contentState.getEntity(entity).getMutability();

        return (entityMutability === mutability);
      } else {
        return false;
      }
    }, callback);
  };

  return strategy;
};

const compositeDecorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy('MUTABLE'),
    component: Word,
  }
]);

export { compositeDecorator, customKeyBindingFn };