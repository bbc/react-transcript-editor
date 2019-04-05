function returnHotKeys(self) {
  return {
    'alt+k': {
      priority: 1,
      handler: () => {
        self.togglePlayMedia();

        self.props.handleAnalyticsEvents({
          category: 'defaultHotKeys',
          action: 'alt+k',
          name: 'togglePlayMedia',
          value: 'na'
        });
      },
      displayKeyCombination: 'alt + k',
      label: 'Play Media'
    },
    'alt+l': {
      priority: 1,
      handler: () => {
        self.skipForward();

        self.props.handleAnalyticsEvents({
          category: 'defaultHotKeys',
          action: 'alt+l',
          name: 'skipForward',
          value: 'na'
        });
      },
      displayKeyCombination: 'alt + l',
      label: 'Fast Forward'
    },
    'alt+j': {
      priority: 1,
      handler: () => {
        self.skipBackward();

        self.props.handleAnalyticsEvents({
          category: 'defaultHotKeys',
          action: 'alt+j',
          name: 'skipBackward',
          value: 'na'
        });
      },
      displayKeyCombination: 'alt + j',
      label: 'Rewind'
    },
    'alt+-': {
      priority: 1,
      handler: () => {
        self.decreasePlaybackRate();

        self.props.handleAnalyticsEvents({
          category: 'defaultHotKeys',
          action: 'alt+-',
          name: 'decreasePlaybackRate',
          value: 'na'
        });
      },
      displayKeyCombination: 'alt + -',
      label: 'Decrease Playback Speed'
    },
    // https://github.com/ccampbell/mousetrap/issues/266
    'alt+=': {
      priority: 1,
      handler: () => {
        self.increasePlaybackRate();

        self.props.handleAnalyticsEvents({
          category: 'defaultHotKeys',
          action: 'alt+plus',
          name: 'increasePlaybackRate',
          value: 'na'
        });
      },
      displayKeyCombination: 'alt + +',
      label: 'Increase Playback Speed'
    },
    'alt+r': {
      priority: 1,
      handler: () => {
        self.rollBack();

        self.props.handleAnalyticsEvents({
          category: 'defaultHotKeys',
          action: 'alt+r',
          name: 'rollBack',
          value: 'na'
        });
      },
      displayKeyCombination: 'alt + r',
      label: 'Roll Back'
    },
    'alt+t': {
      priority: 1,
      handler: () => {
        self.promptSetCurrentTime();

        self.props.handleAnalyticsEvents({
          category: 'defaultHotKeys',
          action: 'alt+t',
          name: 'promptSetCurrentTime',
          value: 'na'
        });
      },
      displayKeyCombination: 'alt + t',
      label: 'set current time'
    }
  };
}
export default returnHotKeys;
