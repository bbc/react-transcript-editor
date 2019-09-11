import React from 'react';
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

class MediaPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTime: this.props.currentTime,
      playbackRate: 1,
      rollBackValueInSeconds: this.props.rollBackValueInSeconds,
      timecodeOffset: this.props.timecodeOffset,
      hotKeys: returnHotKeys(this),
      isPlaying: false,
      playbackRateOptions: PLAYBACK_RATES,
      previewIsDisplayed: true,
      isMute: false,
    };
  }

  /*eslint-disable camelcase */
  hot_keys = returnHotKeys(this);

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.timecodeOffset !== null) {
      let newCurrentTimeInSeconds = nextProps.timecodeOffset;

      if (
        typeof newCurrentTimeInSeconds === 'string' &&
        newCurrentTimeInSeconds.includes(':') &&
        !newCurrentTimeInSeconds.includes('NaN')
      ) {
        newCurrentTimeInSeconds = timecodeToSeconds(nextProps.timecodeOffset);
      }

      return {
        timecodeOffset: newCurrentTimeInSeconds,
        rollBackValueInSeconds: nextProps.rollBackValueInSeconds
      };
    }

    return null;
  }

  componentDidMount() {
    // TODO: Refactor hook functions - are they still needed? Causing performance issues.
    this.props.hookSeek(this.setCurrentTime);
    this.props.hookPlayMedia(this.togglePlayMedia);
    this.props.hookIsPlaying(this.isPlaying);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.rollBackValueInSeconds !== this.state.rollBackValueInSeconds) return true;
    if (nextProps.timecodeOffset !== this.state.timecodeOffset) return true;

    if (nextProps.currentTime !== this.props.currentTime) return true;
    if (nextState.playbackRate !== this.state.playbackRate) return true;
    if (nextProps.mediaDuration !== this.props.mediaDuration ) return true;
    if (nextState.isMute !== this.state.isMute) return true;

    return false;
  }

  setCurrentTime = newCurrentTime => {
    if (newCurrentTime) {
      const newCurrentTimeInSeconds = timecodeToSeconds(newCurrentTime);

      this.setState({
        currentTime: newCurrentTimeInSeconds
      }, () => {
        const videoRef = this.props.videoRef.current;
        if (videoRef.readyState === 4) {
          videoRef.currentTime = newCurrentTimeInSeconds;
        }

        if (!this.state.isPlaying) this.playMedia();
      });
    }
  };

  promptSetCurrentTime = () => {
    let userTimecodeValue = prompt(
      'Jump to time - hh:mm:ss:ff hh:mm:ss mm:ss m:ss m.ss seconds'
    );
    // TODO: add some validation, eg if user types just a string it won't crash.
    // needs function to check it's either timecode on the formats specified above or a number
    // this could be part of the timecode module(?)
    if (this.props.handleAnalyticsEvents) {
      this.props.handleAnalyticsEvents({
        category: 'MediaPlayer',
        action: 'promptSetCurrentTime',
        name: 'userTimecodeValue',
        value: userTimecodeValue
      });
    }
    // user clicks cancel to prompt, prompt returns null
    if (userTimecodeValue) {
      if (userTimecodeValue.includes(':')) {
        userTimecodeValue = timecodeToSeconds(userTimecodeValue);
      }

      if (this.state.timecodeOffset !== 0) {
        userTimecodeValue -= this.state.timecodeOffset;
      }

      this.setCurrentTime(userTimecodeValue);
    }
  };

  setTimeCodeOffset = newTimeCodeOffSet => {
    if (newTimeCodeOffSet) {
      if (newTimeCodeOffSet.includes(':')) {
        this.setState({
          timecodeOffset: timecodeToSeconds(newTimeCodeOffSet)
        });
      }
    }

    if (this.props.handleAnalyticsEvents) {
      this.props.handleAnalyticsEvents({
        category: 'MediaPlayer',
        action: 'setTimeCodeOffset',
        name: 'timecodeOffsetValue',
        value: newTimeCodeOffSet
      });
    }
  };

  rollBack = () => {
    const videoRef = this.props.videoRef.current;
    const newTime = this.state.currentTime - this.state.rollBackValueInSeconds;

    this.setCurrentTime(newTime);

    if (this.props.handleAnalyticsEvents) {
      this.props.handleAnalyticsEvents({
        category: 'MediaPlayer',
        action: 'rollBack',
        name: 'rollBackValue',
        value: this.state.rollBackValueInSeconds
      });
    }
  };

  handlePlayBackRateChange = e => {
    this.setPlayBackRate(parseFloat(e.target.value));
  };

  /**
   * @param {float} rate - playback rate
   */
  setPlayBackRate = rate => {
    if (rate >= 0.2 && rate <= 3.5) {
      this.setState({ playbackRate: rate },
        () => {
          this.props.videoRef.current.playbackRate = rate;

          if (this.props.handleAnalyticsEvents) {
            this.props.handleAnalyticsEvents({
              category: 'MediaPlayer',
              action: 'setPlayBackRate',
              name: 'playbackRateNewValue',
              value: rate
            });
          }
        }
      );
    }
  };

  decreasePlaybackRate = () => {
    const speeds = [ ...PLAYBACK_RATES ].reverse();
    const slower = speeds.find(option => option.value < this.state.playbackRate);
    const newSpeed = slower ? slower.value : 0.2;

    this.setPlayBackRate(newSpeed);
  };

  increasePlaybackRate = () => {
    const speeds = [ ...PLAYBACK_RATES ];
    const faster = speeds.find(option => option.value > this.state.playbackRate);
    const newSpeed = faster ? faster.value : 3.5;

    this.setPlayBackRate(newSpeed);
  };

  handleChangeReplayRollbackValue = e => {
    this.setState({
      rollBackValueInSeconds: e.target.value
    });
  };

  handleMuteVolume = () => {
    if (this.props.videoRef.current.volume > 0) {
      this.props.videoRef.current.volume = 0;
      this.setState({ isMute: true });
    } else {
      this.props.videoRef.current.volume = 1;
      this.setState({ isMute: false });
    }
  };

  // TEMP: Needs replacing - but pauseWhileTyping (in TimedTextEditor) currently uses this
  isPlaying = () => {
    return !this.props.videoRef.current.paused;
  };

  pauseMedia = () => {
    this.setState({ isPlaying: false }, () => this.props.videoRef.current.pause());

    if (this.props.handleAnalyticsEvents) {
      this.props.handleAnalyticsEvents({
        category: 'MediaPlayer',
        action: 'pauseMedia',
        name: 'pauseMedia',
        value: secondsToTimecode(this.state.currentTime)
      });
    }
  };

  playMedia = () => {
    this.setState({ isPlaying: true }, () => this.props.videoRef.current.play());

    if (this.props.handleAnalyticsEvents) {
      this.props.handleAnalyticsEvents({
        category: 'MediaPlayer',
        action: 'playMedia',
        name: 'playMedia',
        value: secondsToTimecode(this.state.currentTime)
      });
    }
  };

  togglePlayMedia = () => {
    if (this.state.isPlaying) {
      this.pauseMedia();
    } else {
      this.playMedia();
    }
  };

  skipForward = () => {
    const currentTime = this.state.currentTime;
    const newCurrentTimeIncreased = currentTime + 10;
    const newCurrentTime = Number(newCurrentTimeIncreased.toFixed(1));

    this.setCurrentTime(newCurrentTime);
  };

  skipBackward = () => {
    const currentTime = this.state.currentTime;
    const newCurrentTimeIncreased = currentTime - 10;
    const newCurrentTime = Number(newCurrentTimeIncreased.toFixed(1));

    this.setCurrentTime(newCurrentTime);
  };

  handleProgressBarClick = e => {
    const time = e.target.value;
    this.setCurrentTime(time);

    if (this.props.handleAnalyticsEvents) {
      this.props.handleAnalyticsEvents({
        category: 'MediaPlayer',
        action: 'handleProgressBarClick',
        name: 'roundNewCurrentTime',
        value: time
      });
    }
  };

  getMediaCurrentTime = () => secondsToTimecode(this.state.currentTime + this.state.timecodeOffset);

  handlePictureInPicture = () => {
    if (document.pictureInPictureElement !== undefined) {
      // from https://developers.google.com/web/updates/2017/09/picture-in-picture
      if (!document.pictureInPictureElement) {
        if (this.props.handleAnalyticsEvents) {
          this.props.handleAnalyticsEvents({
            category: 'MediaPlayer',
            action: 'handlePictureInPicture',
            name: 'turning-picture-in-picture-on'
          });
        }

        this.props.videoRef.current.requestPictureInPicture().catch(error => {
          console.error('Video failed to enter Picture-in-Picture mode', error);

          if (this.props.handleAnalyticsEvents) {
            this.props.handleAnalyticsEvents({
              category: 'MediaPlayer',
              action: 'handlePictureInPicture',
              name: 'turning-picture-in-picture-on-error'
            });
          }
        });
      } else {
        if (this.props.handleAnalyticsEvents) {
          this.props.handleAnalyticsEvents({
            category: 'MediaPlayer',
            action: 'handlePictureInPicture',
            name: 'turning-picture-in-picture-off'
          });
        }

        document.exitPictureInPicture().catch(error => {
          console.error('Video failed to leave Picture-in-Picture mode', error);

          if (this.props.handleAnalyticsEvents) {
            this.props.handleAnalyticsEvents({
              category: 'MediaPlayer',
              action: 'handlePictureInPicture',
              name: 'turning-picture-in-picture-off-error'
            });
          }
        });
      }
    } else {
      alert('Picture in Picture not supported in this browser, try chrome.');
      if (this.props.handleAnalyticsEvents) {
        this.props.handleAnalyticsEvents({
          category: 'MediaPlayer',
          action: 'handlePictureInPicture',
          name: 'picture-in-picture-not-supported'
        });
      }
    }
  };

  render() {
    const progressBar = (
      <ProgressBar
        max={ this.props.videoRef.current.duration }
        value={ this.state.currentTime }
        buttonClick={ this.handleProgressBarClick }
      />
    );

    const playerControlsSection = (
      <div className={ styles.controlsSection }>
        {this.props.title ? <h2 className={ styles.title }>{this.props.title}</h2> : null}
        <PlayerControls
          playMedia={ this.togglePlayMedia.bind(this) }
          isPlaying={ this.state.isPlaying }
          isMute={ this.state.isMute }
          playbackRate={ this.state.playbackRate }
          skipBackward={ this.skipBackward.bind(this) }
          skipForward={ this.skipForward.bind(this) }
          rollback={ this.rollBack }
          currentTime={ this.getMediaCurrentTime() }
          duration={ this.props.mediaDuration }
          onSetCurrentTime={ '' }
          onSetTimecodeOffset={ '' }
          promptSetCurrentTime={ this.promptSetCurrentTime.bind(this) }
          setTimeCodeOffset={ this.setTimeCodeOffset.bind(this) }
          timecodeOffset={ secondsToTimecode(this.state.timecodeOffset) }
          handleMuteVolume={ this.handleMuteVolume.bind(this) }
          setPlayBackRate={ this.handlePlayBackRateChange.bind(this) }
          playbackRateOptions={ this.state.playbackRateOptions }
          pictureInPicture={ this.handlePictureInPicture }
          handleSaveTranscript={ () => { this.props.handleSaveTranscript(); } }
        />
        {this.props.mediaUrl ? progressBar : null}
      </div>
    );

    return (
      <section className={ styles.topSection }>
        <div className={ styles.playerSection }>
          {this.props.mediaUrl ? playerControlsSection : null}
        </div>
      </section>
    );
  }
}

MediaPlayer.propTypes = {
  currentTime: PropTypes.number,
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
