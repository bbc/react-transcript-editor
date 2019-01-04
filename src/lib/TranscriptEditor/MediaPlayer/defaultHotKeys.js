function returnHotKeys(self) {
  return {
    'alt+space': {
      priority: 1,
      handler: () => {
        self.togglePlayMedia();

        self.props.handleAnalyticsEvents({
          category: 'defaultHotKeys',
          action: 'alt+space',
          name: 'togglePlayMedia',
          value: 'na'
        });

      },
      label: 'Play Media',
    },
    'shift+right': {
      priority: 1,
      handler: () => {
        self.skipForward();

        self.props.handleAnalyticsEvents({
          category: 'defaultHotKeys',
          action: 'alt+right',
          name: 'skipForward',
          value: 'na'
        });

      },
      label: 'Skip Forward',
    },
    'shift+left': {
      priority: 1,
      handler: () => {
        self.skipBackward();

        self.props.handleAnalyticsEvents({
          category: 'defaultHotKeys',
          action: 'alt+left',
          name: 'skipBackward',
          value: 'na'
        });

      },
      label: 'Skip Backward',
    },
    'shift+down': {
      priority: 1,
      handler: () => {
        self.decreasePlaybackRate();

        self.props.handleAnalyticsEvents({
          category: 'defaultHotKeys',
          action: 'command+down',
          name: 'decreasePlaybackRate',
          value: 'na'
        });

      },
      label: 'Speed Down',
    },
    'shift+up': {
      priority: 1,
      handler: () => {
        self.increasePlaybackRate();

        self.props.handleAnalyticsEvents({
          category: 'defaultHotKeys',
          action: 'command+up',
          name: 'increasePlaybackRate',
          value: 'na'
        });

      },
      label: 'Speed Up',
    },
    'alt+shift+left': {
      priority: 1,
      handler: () => {
        self.rollBack();

        self.props.handleAnalyticsEvents({
          category: 'defaultHotKeys',
          action: 'command+left',
          name: 'rollBack',
          value: 'na'
        });

      },
      label: 'Roll Back',
    },
    'alt+k': {
      priority: 1,
      handler: () => {
        self.promptSetCurrentTime();

        self.props.handleAnalyticsEvents({
          category: 'defaultHotKeys',
          action: 'alt+k',
          name: 'promptSetCurrentTime',
          value: 'na'
        });

      },
      label: 'set current time',
    }
  };
}
export default returnHotKeys;