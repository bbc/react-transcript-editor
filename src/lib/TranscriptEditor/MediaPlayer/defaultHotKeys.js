function returnHotKeys(self) {
  return {
    'esc': {
      priority: 1,
      handler: () => { self.togglePlayMedia(); },
      label: 'Play Media',
    },
    'ctrl+k': { // combo from mousetrap
      priority: 1,
      handler: () => { self.promptSetCurrentTime(); },
      label: 'set current time',
    },
    'ctrl+1': {
      priority: 1,
      handler: () => { self.skipForward(); },
      label: 'Skip Forward',
    },
    'ctrl+2': {
      priority: 1,
      handler: () => { self.skipBackward(); },
      label: 'Skip Backward',
    },
    'ctrl+3': {
      priority: 1,
      handler: () => { self.decreasePlaybackRate(); },
      label: 'Speed Down',
    },
    'ctrl+4': {
      priority: 1,
      handler: () => { self.increasePlaybackRate(); },
      label: 'Speed Up',
    },
    'ctrl+5': {
      priority: 1,
      handler: () => { self.rollBack(); },
      label: 'Roll Back',
    }
  };
}
export default returnHotKeys;
