import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, number, boolean } from '@storybook/addon-knobs';

import Settings from '../index.js';

storiesOf('Settings', module)
  .addDecorator(withKnobs)
  .add('default', () => {

    const fixtureProps = {
      handleSettingsToggle: action('Toggle settings'),
      showTimecodes: boolean('showTimecodes', true),
      showSpeakers: boolean('showSpeakers', true),
      timecodeOffset: number('timecodeOffset', 3600),
      defaultValueScrollSync: boolean('defaultValueScrollSync', true),
      defaultValuePauseWhileTyping: boolean('defaultValuePauseWhileTyping', true),
      defaultRollBackValueInSeconds: number('defaultRollBackValueInSeconds', 10),
      previewIsDisplayed: boolean('previewIsDisplayed', true),
      handleShowTimecodes: action('handleShowTimecodes'),
      handleShowSpeakers: action('handleShowSpeakers'),
      handleSetTimecodeOffset: action('handleSetTimecodeOffset'),
      handleSettingsToggle: action('handleSettingsToggle'),
      handlePauseWhileTyping: action('handlePauseWhileTyping'),
      handleIsScrollIntoViewChange: action('handleIsScrollIntoViewChange'),
      handleRollBackValueInSeconds: action('handleRollBackValueInSeconds'),
      handlePreviewIsDisplayed: action('handlePreviewIsDisplayed'),
      handleChangePreviewViewWidth: action('handleChangePreviewViewWidth'),
      handleAnalyticsEvents: action('handleAnalyticsEvents')
    };

    return (
      <Settings { ...fixtureProps } />
    );});
