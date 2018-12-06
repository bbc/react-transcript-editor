function returnHotKeys(self) {
  return {
    'esc': {
      priority: 1,
      handler: () => { 
        self.togglePlayMedia(); 
        
        self.props.handleAnalyticsEvents({ 
          category: 'defaultHotKeys', 
          action: 'esc', 
          name: 'togglePlayMedia', 
          value: 'na'
        });

      },
      label: 'Play Media',
    },
    'esc': {
      priority: 1,
      handler: () => { 
        self.promptSetCurrentTime();
        
        self.props.handleAnalyticsEvents({ 
          category: 'defaultHotKeys', 
          action: 'ctrl+k', 
          name: 'promptSetCurrentTime', 
          value: 'na'
        });

      },
      label: 'set current time',
    },
    'alt+right': {
      priority: 1,
      handler: () => {
        self.skipForward(); 

        self.props.handleAnalyticsEvents({ 
          category: 'defaultHotKeys', 
          action: 'ctrl+1', 
          name: 'skipForward', 
          value: 'na'
        });

      },
      label: 'Skip Forward',
    },
    'alt+left': {
      priority: 1,
      handler: () => { 
        self.skipBackward(); 

        self.props.handleAnalyticsEvents({ 
          category: 'defaultHotKeys', 
          action: 'ctrl+2', 
          name: 'skipBackward', 
          value: 'na'
        });

      },
      label: 'Skip Backward',
    },
    'alt+down': {
      priority: 1,
      handler: () => { 
        self.decreasePlaybackRate(); 

        self.props.handleAnalyticsEvents({ 
          category: 'defaultHotKeys', 
          action: 'ctrl+3', 
          name: 'decreasePlaybackRate', 
          value: 'na'
        });

      },
      label: 'Speed Down',
    },
    'alt+up': {
      priority: 1,
      handler: () => { 
        self.increasePlaybackRate(); 

        self.props.handleAnalyticsEvents({ 
          category: 'defaultHotKeys', 
          action: 'ctrl+4', 
          name: 'increasePlaybackRate', 
          value: 'na'
        });

      },
      label: 'Speed Up',
    },
    'command+left': {
      priority: 1,
      handler: () => { 
        self.rollBack(); 
        
        self.props.handleAnalyticsEvents({ 
          category: 'defaultHotKeys', 
          action: 'ctrl+5', 
          name: 'rollBack', 
          value: 'na'
        });

      },
      label: 'Roll Back',
    }
  };
}
export default returnHotKeys;
