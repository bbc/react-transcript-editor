import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, number, boolean, object } from '@storybook/addon-knobs';

import bbcKaldiTranscript from './fixtures/bbc-kaldi.json';

import TranscriptEditor from '../index.js';

storiesOf('TranscriptEditor', module)
  .addDecorator(withKnobs)
  .add('default', () => {
    const fixtureProps = {
      title: text('title', 'Ted Talk'),
      mediaUrl: text('mediaUrl', 'https://download.ted.com/talks/KateDarling_2018S-950k.mp4'),
      sttJsonType: text('sttJsonType', 'bbckaldi' ),
      isEditable: boolean('isEditable', true ),
      spellCheck: boolean('spellCheck', false ),
      fileName: text('fileName', 'KateDarling_2018S-950k.mp4' ),
      transcriptData: object('transcriptData', bbcKaldiTranscript),
      handleAnalyticsEvents: action('Analytics event')
    };

    return (
      <TranscriptEditor { ...fixtureProps }/>
    );
  });
