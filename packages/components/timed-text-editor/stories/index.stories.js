import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, number, boolean } from '@storybook/addon-knobs';

import bbcKaldiTranscript from './fixtures/bbc-kaldi.json';

import TimedTextEditor from '../index.js';

storiesOf('TimedTextEditor', module)
  .addDecorator(withKnobs)
  .add('default', () => {
    const mediaUrl = 'https://download.ted.com/talks/KateDarling_2018S-950k.mp4';

    const fixtureProps = {
      transcriptData: bbcKaldiTranscript,
      mediaUrl: text('mediaUrl', mediaUrl),
      isEditable: boolean('isEditable', true),
      spellCheck: boolean('spellCheck', false),
      onWordClick: action('onWordClick'),
      sttJsonType: text('sttJsonType', 'bbckaldi'),
      isPlaying: action('isPlaying'),
      playMedia: action('playMedia'),
      currentTime: number('currentTime', 0),
      isScrollIntoViewOn: boolean('isScrollIntoViewOn', true),
      isPauseWhileTypingOn: boolean('isPauseWhileTypingOn', true),
      timecodeOffset: number('timecodeOffset', 0),
      handleAnalyticsEvents: action('handleAnalyticsEvents'),
      showSpeakers: boolean('showSpeakers', true),
      showTimecodes: boolean('showTimecodes', true),
      fileName: text('fileName', 'KateDarling_2018S-950k.mp4')
    };

    return (
      <TimedTextEditor { ...fixtureProps } />
    );
  });
