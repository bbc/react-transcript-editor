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
      handler: () => { self.skipForward(); console.log('Skip Forward'); },
      label: 'Skip Forward',
    },
    'ctrl+2': {
      priority: 1,
      handler: () => { self.skipBackward(); console.log('Skip Backward'); },
      label: 'Skip Backward',
    },
    'ctrl+3': {
      priority: 1,
      handler: () => { self.decreasePlaybackRate(); console.log('decrease'); },
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
    // ,'ctrl+/': {
    //     priority: 1,
    //     handler: (event) => { console.log('show hide shortcuts');},
    //     helperText: 'Show/Hide shortcuts'
    // }
    // ,'ctrl+s': {
    //     priority: 1,
    //     handler: (event) => { console.log('save');},
    //     helperText: 'Save'
    // }
  };
}
export default returnHotKeys;
