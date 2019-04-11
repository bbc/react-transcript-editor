import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, number } from '@storybook/addon-knobs';

import MediaPlayer from '../index.js';

storiesOf('MediaPlayer', module)
  .addDecorator(withKnobs)
  .add('default', () => {
    const videoRef = React.createRef();

    const mediaUrl = 'https://download.ted.com/talks/KateDarling_2018S-950k.mp4';

    const fixtureProps = {
      videoRef: videoRef,
      title: text('title', 'Ted Talk'),
      hookSeek: action('hookSeek'),
      hookPlayMedia: action('hookPlayMedia'),
      hookIsPlaying: action('hookIsPlaying'),
      mediaUrl: text('mediaUrl', mediaUrl),
      hookOnTimeUpdate: action('hookOnTimeUpdate'),
      rollBackValueInSeconds: number('rollBackValueInSeconds', 10),
      timecodeOffset: number('timecodeOffset', 0),
      handleAnalyticsEvents: action('handleAnalyticsEvents'),
      mediaDuration: text('mediaDuration', '01:00:00:00'),
      handleSaveTranscript: action('handleSaveTranscript')
    };

    return (
      <React.Fragment>
        <MediaPlayer { ...fixtureProps } />
        <br/>
        <video ref={ videoRef } style={ { width: '50%' } }>
          <source
            type="video/mp4"
            src={ mediaUrl }
          />
        </video>
      </React.Fragment>
    );
  });
