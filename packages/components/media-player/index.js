import React, { useState, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { hotkeys } from 'react-keyboard-shortcuts';

import PlayerControls from './src/PlayerControls';
import ProgressBar from './src/ProgressBar';

import returnHotKeys from './src/config/defaultHotKeys';

import styles from './index.module.scss';

import {
  secondsToTimecode,
  timecodeToSeconds
} from '../../util/timecode-converter';

import PLAYBACK_RATES from './src/config/playbackRates.js';

const MediaPlayer = (props) => {

  const [ playbackRate, setPlayBackRate ] = useState(1);
  const [ timecodeOffset, setTimecodeOffset ] = useState(props.timecodeOffset);

  const [ rollBackSeconds, setRollBackValueInSeconds ] = useState(props.rollBackValueInSeconds);
  const [ hotKeys, setHotkeys ] = useState(() => returnHotKeys);

  const [ previewIsDisplayed, setPreviewIsDisplayed ] = useState(true);
  const [ isMute, setIsMute ] = useState(false);
  const [ isPlaying, setIsPlaying ] = useState(false);

  const hot_keys = returnHotKeys();

  // setting time should be unified

  const setCurrentTime = (newCurrentTime) => {
    if (newCurrentTime) {
      // hh:mm:ss:ff - mm:ss - m:ss - ss - seconds number or string and hh:mm:ss
      const newCurrentTimeInSeconds = timecodeToSeconds(newCurrentTime);
      const videoRef = props.videoRef.current;

      if (videoRef.readyState === 4) {
        videoRef.currentTime = newCurrentTimeInSeconds;
        isPlaying(true);
      }
    }
  };

  const getTimeCodeSeconds = (timecode) => {
    if (timecode.includes(':')) {
      return timecodeToSeconds(timecode);
    }

    return timecode;
  };
  /**
   * Prompts for a time stamp or time code to set media current time
   * Also handles use can when the user has set a timecode offset via settings
   * and the prompt is expected to be relative to that offset
   */
  const promptSetCurrentTime = () => {
    let userTimecodeValue = prompt(
      'Jump to time - hh:mm:ss:ff hh:mm:ss mm:ss m:ss m.ss seconds'
    );
    // TODO: add some validation, eg if user types just a string it won't crash.
    // needs function to check it's either timecode on the formats specified above or a number
    // this could be part of the timecode module(?)
    handleAnalyticEventsWrapper('promptSetCurrentTime', 'userTimecodeValue', userTimecodeValue);

    if (userTimecodeValue) {
      userTimecodeValue = getTimeCodeSeconds(userTimecodeValue);
      userTimecodeValue -= timecodeOffset;
      setCurrentTime(userTimecodeValue);
    }
  };

  const rollback = () => {
    handleAnalyticEventsWrapper('rollBack', 'rollBackValue', rollBackSeconds);
    const time = props.videoRef.current.currentTime - rollBackSeconds;
    props.videoRef.current.currentTime = time;
  };
  // - ------ - --- -

  useEffect(() => {

    const handleAnalyticEventsWrapper = (action, name, value) => {
      if (props.handleAnalyticsEvents) {
        props.handleAnalyticsEvents({
          category: 'MediaPlayer',
          action,
          name,
          value
        });
      }
    };

    const playMedia = () => {
      const videoRef = props.videoRef.current;
      videoRef.play();
      handleAnalyticEventsWrapper('playMedia', 'playMedia', secondsToTimecode(props.videoRef.current.currentTime));

    };
    const pauseMedia = () => {
      const videoRef = props.videoRef.current;
      videoRef.pause();
      handleAnalyticEventsWrapper('pauseMedia', 'pauseMedia', secondsToTimecode(props.videoRef.current.currentTime));
    };

    if (isPlaying) {
      playMedia();
    } else {
      pauseMedia();
    }

    if (playbackRate !== props.videoRef.current.playbackRate) {
      props.videoRef.current.playbackRate = playbackRate;
    }

    return () => {
    };
  }, [ isPlaying, playbackRate, props, props.videoRef ]);

  const handlePlayBackRateChange = e => {
    handleAnalyticEventsWrapper('setPlayBackRate', 'playbackRateNewValue', e.target.value);
    setPlayBackRate(parseFloat(e.target.value));
  };

  const handleMuteVolume = () => {
    if (props.videoRef.current.volume > 0) {
      props.videoRef.current.volume = 0;
      setIsMute(true);
    } else {
      props.videoRef.current.volume = 1;
      setIsMute(false);
    }
  };

  // Sets isPlaying state and toggles modes on the video player
  // TODO: modularise these / enable specific play / pause action
  const togglePlayMedia = () => {
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    const currentTime = props.videoRef.current.currentTime;
    const newCurrentTimeIncreased = currentTime + 10;
    const newCurrentTime = Number(newCurrentTimeIncreased.toFixed(1));

    setCurrentTime(newCurrentTime);
  };

  const skipBackward = () => {
    const currentTime = props.videoRef.current.currentTime;
    const newCurrentTimeIncreased = currentTime - 10;
    const newCurrentTime = Number(newCurrentTimeIncreased.toFixed(1));

    setCurrentTime(newCurrentTime);
  };

  const handleProgressBarClick = e => {
    const time = e.target.value;
    setCurrentTime(time);

    if (props.handleAnalyticsEvents) {
      props.handleAnalyticsEvents({
        category: 'MediaPlayer',
        action: 'handleProgressBarClick',
        name: 'roundNewCurrentTime',
        value: time
      });
    }
  };

  const getMediaCurrentTime = () => secondsToTimecode(props.videoRef.current.currentTime + timecodeOffset);

  const handlePictureInPicture = () => {
    if (document.pictureInPictureElement !== undefined) {
      // from https://developers.google.com/web/updates/2017/09/picture-in-picture
      if (!document.pictureInPictureElement) {
        if (props.handleAnalyticsEvents) {
          props.handleAnalyticsEvents({
            category: 'MediaPlayer',
            action: 'handlePictureInPicture',
            name: 'turning-picture-in-picture-on'
          });
        }

        props.videoRef.current.requestPictureInPicture().catch(error => {
          console.error('Video failed to enter Picture-in-Picture mode', error);

          if (props.handleAnalyticsEvents) {
            props.handleAnalyticsEvents({
              category: 'MediaPlayer',
              action: 'handlePictureInPicture',
              name: 'turning-picture-in-picture-on-error'
            });
          }
        });
      } else {
        if (props.handleAnalyticsEvents) {
          props.handleAnalyticsEvents({
            category: 'MediaPlayer',
            action: 'handlePictureInPicture',
            name: 'turning-picture-in-picture-off'
          });
        }

        document.exitPictureInPicture().catch(error => {
          console.error('Video failed to leave Picture-in-Picture mode', error);

          if (props.handleAnalyticsEvents) {
            props.handleAnalyticsEvents({
              category: 'MediaPlayer',
              action: 'handlePictureInPicture',
              name: 'turning-picture-in-picture-off-error'
            });
          }
        });
      }
    } else {
      alert('Picture in Picture not supported in this browser, try chrome.');
      if (props.handleAnalyticsEvents) {
        props.handleAnalyticsEvents({
          category: 'MediaPlayer',
          action: 'handlePictureInPicture',
          name: 'picture-in-picture-not-supported'
        });
      }
    }
  };

  const getProgressBarMax = () => parseInt(props.videoRef.current.duration).toString();
  const getProgressBarValue = () => parseInt(props.videoRef.current.currentTime).toString();

  const progressBar = (
    <ProgressBar
      max={ getProgressBarMax() }
      value={ getProgressBarValue() }
      buttonClick={ handleProgressBarClick }
    />
  );

  const playerControlsSection = (
    <div className={ styles.controlsSection }>
      {props.title ? <h2 className={ styles.title }>{props.title}</h2> : null}
      <PlayerControls
        playMedia={ () => togglePlayMedia }
        isPlaying={ isPlaying }
        isMute={ isMute }
        playbackRate={ playbackRate }
        skipBackward={ () => skipBackward }
        skipForward={ () => skipForward }
        rollback={ rollback }
        currentTime={ getMediaCurrentTime() }
        duration={ props.mediaDuration }
        promptSetCurrentTime={ () => promptSetCurrentTime }
        timecodeOffset={ secondsToTimecode(timecodeOffset) }
        handleMuteVolume={ () => handleMuteVolume }
        setPlayBackRate={ () => handlePlayBackRateChange }
        playbackRateOptions={ PLAYBACK_RATES }
        pictureInPicture={ handlePictureInPicture }
        handleSaveTranscript={ () => {
          props.handleSaveTranscript();
        } }
      />
      {props.mediaUrl ? progressBar : null}
    </div>
  );

  return (
    <section className={ styles.topSection }>
      <div className={ styles.playerSection }>
        {props.mediaUrl ? playerControlsSection : null}
      </div>
    </section>
  );

};

MediaPlayer.propTypes = {
  videoRef: PropTypes.object.isRequired,
  title: PropTypes.string,
  hookSeek: PropTypes.func,
  hookPlayMedia: PropTypes.func,
  hookIsPlaying: PropTypes.func,
  mediaUrl: PropTypes.string,
  hookOnTimeUpdate: PropTypes.func,
  rollBackValueInSeconds: PropTypes.number,
  timecodeOffset: PropTypes.number,
  handleAnalyticsEvents: PropTypes.func,
  mediaDuration: PropTypes.string,
  handleSaveTranscript: PropTypes.func
};

export default hotkeys(MediaPlayer);
