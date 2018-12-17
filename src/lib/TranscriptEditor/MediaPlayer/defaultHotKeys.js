function returnHotKeys(self) {
  return {
    esc: {
      priority: 1,
      handler: () => { self.playMedia(); },
      helperText: 'Play Media',
    },
    'ctrl+k': { // combo from mousetrap
      priority: 1,
      handler: () => { self.promptSetCurrentTime(); },
      helperText: 'set current time',
    },
    'ctrl+1': {
      priority: 1,
      handler: () => { self.skipForward(); console.log('Skip Forward'); },
      helperText: 'Skip Forward',
    },
    'ctrl+2': {
      priority: 1,
      handler: () => { self.skipBackward(); console.log('Skip Backward'); },
      helperText: 'Skip Backward',
    },
    'ctrl+3': {
      priority: 1,
      handler: () => { self.decreasePlaybackRate(); console.log('Speed Up - increase playbackRate'); },
      helperText: 'Speed Up ',
    },
    'ctrl+4': {
      priority: 1,
      handler: () => { self.increasePlaybackRate(); console.log('Speed Down - Decrease playbackRate'); },
      helperText: 'Speed Down',
    },
    'ctrl+5': {
      priority: 1,
      handler: () => { self.rollBack(); },
      helperText: 'Roll Back',
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
