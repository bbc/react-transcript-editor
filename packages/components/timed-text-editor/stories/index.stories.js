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
      isScrollIntoView: boolean('isScrollIntoView', true),
      isPauseWhileTyping: boolean('isPauseWhileTyping', true),
      showSpeakers: boolean('showSpeakers', true),
      showTimecodes: boolean('showTimecodes', true),
      sttJsonType: text('sttJsonType', 'bbckaldi'),
      handleWordClick: action('handleWordClick'),
      handleSave: action('handleSave'),
      handleEdit: action('handleEdit'),
      handleAnalyticsEvents: action('handleAnalyticsEvents'),
      currentTime: number('currentTime', 0),
      timecodeOffset: number('timecodeOffset', 0),
      fileName: text('fileName', 'KateDarling_2018S-950k.mp4'),
    };

    return (
      <TimedTextEditor { ...fixtureProps } />
    );
  });
