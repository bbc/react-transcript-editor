import React from 'react';
import PropTypes from 'prop-types';
import { hotkeys } from 'react-keyboard-shortcuts';

import VideoPlayer from './VideoPlayer';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';

import returnHotKeys from './defaultHotKeys';
import styles from './index.module.css';

import { secondsToTimecode, timecodeToSeconds } from '../../Util/timecode-converter/index';
import { timingSafeEqual } from 'crypto';

const PLAYBACK_RATES = [
  { value: 0.2, label: '0.2' },
  { value: 0.25, label: '0.25' },
  { value: 0.5, label: '0.5' },
  { value: 0.75, label: '0.75' },
  { value: 1, label: '1' },
  { value: 1.25, label: '1.25' },
  { value: 1.5, label: '1.5' },
  { value: 1.75, label: '1.75' },
  { value: 2, label: '2' },
  { value: 2.5, label: '2.5' },
  { value: 3, label: '3' },
  { value: 3.5, label: '3.5' }
];

class MediaPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();

    this.state = {
      playbackRate: 1,
      rollBackValueInSeconds: this.props.rollBackValueInSeconds,
      timecodeOffset: this.props.timecodeOffset,
      hotKeys: returnHotKeys(this),
      isPlaying: false,
      playbackRateOptions: PLAYBACK_RATES,
      mediaDuration: '00:00:00:00'
    };
  }
  /*eslint-disable camelcase */
  hot_keys = returnHotKeys(this);

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.timecodeOffset !== null) {
      let newCurrentTimeInSeconds = nextProps.timecodeOffset ;
      if (typeof newCurrentTimeInSeconds ==='string'
        && newCurrentTimeInSeconds.includes(':')
        && !newCurrentTimeInSeconds.includes('NaN')) {
        newCurrentTimeInSeconds = timecodeToSeconds(nextProps.timecodeOffset );
      }

      return {
        timecodeOffset: newCurrentTimeInSeconds,
        rollBackValueInSeconds: nextProps.rollBackValueInSeconds
      };
    }

    return null;
  }

  componentDidMount() {
    this.props.hookSeek(this.setCurrentTime);
    this.props.hookPlayMedia(this.togglePlayMedia);
    this.props.hookIsPlaying(this.isPlaying);
  }

  setCurrentTime = (newCurrentTime) => {
    if (newCurrentTime !== '' && newCurrentTime !== null) {
    // hh:mm:ss:ff - mm:ss - m:ss - ss - seconds number or string and hh:mm:ss
      const newCurrentTimeInSeconds = timecodeToSeconds(newCurrentTime);
      if (this.videoRef.current !== null) {
        const videoRef = this.videoRef.current;

        if (videoRef.readyState === 4) {
          videoRef.currentTime = newCurrentTimeInSeconds;
          this.playMedia();
        }
      }
    }
  }

  /**
   * Prompts for a time stamp or time code to set media current time
   * Also handles use can when the user has set a timecode offset via settings
   * and the prompt is expected to be relative to that offset
   */
  promptSetCurrentTime = () => {
    let userTimecodeValue = prompt('Jump to time - hh:mm:ss:ff hh:mm:ss mm:ss m:ss m.ss seconds');
    // TODO: add some validation, eg if user types just a string it won't crash.
    // needs function to check it's either timecode on the formats specified above or a number
    // this could be part of the timecode module(?)
    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: 'MediaPlayer',
        action: 'promptSetCurrentTime',
        name: 'userTimecodeValue',
        value: userTimecodeValue
      });
    }
    // user clicks cancel to prompt, prompt returns null
    if (userTimecodeValue !== null) {
      if (userTimecodeValue.includes(':')) {
        userTimecodeValue = timecodeToSeconds(userTimecodeValue);
      }
      // remove timecode offset if preset
      if (this.state.timecodeOffset !== 0) {
        userTimecodeValue -= this.state.timecodeOffset;
      }

      this.setCurrentTime(userTimecodeValue);
    }
  }

  setTimeCodeOffset = (newTimeCodeOffSet) => {
    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: 'MediaPlayer',
        action: 'setTimeCodeOffset',
        name: 'timecodeOffsetValue',
        value: newTimeCodeOffSet
      });
    }

    if (newTimeCodeOffSet !== '' && newTimeCodeOffSet !== null) {
      // use similar helper function from above to convert
      let newCurrentTimeInSeconds = newTimeCodeOffSet;
      if (newTimeCodeOffSet.includes(':')) {
        newCurrentTimeInSeconds = timecodeToSeconds(newTimeCodeOffSet);
        this.setState({ timecodeOffset: newCurrentTimeInSeconds });
      }
    }
  }

  rollBack = () => {
    if (this.videoRef.current !== null) {

      if (this.props.handleAnalyticsEvents !== undefined) {
        this.props.handleAnalyticsEvents({
          category: 'MediaPlayer',
          action: 'rollBack',
          name: 'rollBackValue',
          value: this.state.rollBackValueInSeconds
        });
      }
      // get video duration
      const videoElem = this.videoRef.current;
      const tmpDesiredCurrentTime = videoElem.currentTime - this.state.rollBackValueInSeconds;
      // > 0 < duration of video
      this.setCurrentTime(tmpDesiredCurrentTime);

    }
  }

  handleTimeUpdate = (e) => {
    this.props.hookOnTimeUpdate(e.target.currentTime);
  }

  handlePlayBackRateChange = (e) => {
    this.setPlayBackRate(parseFloat(e.target.value));
  }

  /**
   * @param {float} input - playback rate value as a float
   */
  setPlayBackRate = (input) => {
    if (this.videoRef.current !== null) {
      if (input >= 0.2 && input <= 3.5) {
        this.setState({
          playbackRate: input,
        }, () => {
          this.videoRef.current.playbackRate = input;

          if (this.props.handleAnalyticsEvents !== undefined) {
            this.props.handleAnalyticsEvents({
              category: 'MediaPlayer',
              action: 'setPlayBackRate',
              name: 'playbackRateNewValue',
              value: input
            });
          }

        });
      }
    }
  }

  decreasePlaybackRate = () => {
    const speeds = [ ...PLAYBACK_RATES ].reverse();
    const slower = speeds.find((option) => {
      return option.value < this.state.playbackRate;
    });
    const newSpeed = slower ? slower.value : 0.2;

    this.setPlayBackRate(newSpeed);
  }

  increasePlaybackRate = () => {
    const speeds = [ ...PLAYBACK_RATES ];
    const faster = speeds.find((option) => {
      return option.value > this.state.playbackRate;
    });
    const newSpeed = faster ? faster.value : 3.5;

    this.setPlayBackRate(newSpeed);
  }

  handleChangeReplayRollbackValue = (e) => {
    if (this.videoRef.current !== null) {
      this.setState({
        rollBackValueInSeconds: e.target.value,
      });
    }
  }

  handleMuteVolume = () => {
    if (this.videoRef.current !== null) {
      if (this.videoRef.current.volume > 0) {
        this.videoRef.current.volume = 0;
      } else {
        this.videoRef.current.volume = 1;
      }
    }
  }

  // TEMP: keeping this in for now. Might be replaced by state
  // The pauseWhileTyping logic (in TimedTextEditor) currently uses this
  isPlaying = () => {
    if (this.videoRef.current !== null) {
      if (this.videoRef.current.paused) return false;

      return true;
    }
  }

  pauseMedia = () => {
    this.setState({ isPlaying: false }, () => this.videoRef.current.pause());

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: 'MediaPlayer',
        action: 'pauseMedia',
        name: 'pauseMedia',
        value: secondsToTimecode(this.videoRef.current.currentTime)
      });
    }
  }

  playMedia = () => {
    this.setState({ isPlaying: true }, () => this.videoRef.current.play());

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: 'MediaPlayer',
        action: 'playMedia',
        name: 'playMedia',
        value: secondsToTimecode(this.videoRef.current.currentTime)
      });
    }

  }

  // Sets isPlaying state and toggles modes on the video player
  // TODO: modularise these / enable specific play / pause action
  togglePlayMedia = () => {
    if (this.videoRef.current !== null) {
      if (this.state.isPlaying) {
        this.pauseMedia();
      }
      else {
        this.playMedia();
      }
    }
  }

  skipForward = () => {
    if (this.videoRef.current !== null) {
      // TODO track this?
      const currentTime = this.videoRef.current.currentTime;
      const newCurrentTimeIncreased = currentTime + 10;
      const newCurrentTime = Number((newCurrentTimeIncreased).toFixed(1));
      this.setCurrentTime(newCurrentTime);
    }
  }

  skipBackward = () => {
    // TODO track this?
    if (this.videoRef.current !== null) {
      const currentTime = this.videoRef.current.currentTime;
      const newCurrentTimeIncreased = currentTime - 10;
      const newCurrentTime = Number((newCurrentTimeIncreased).toFixed(1));
      this.setCurrentTime(newCurrentTime);
    }
  }

  handleProgressBarClick = (e) => {
    const time = e.target.value;
    this.setCurrentTime(time);

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: 'MediaPlayer',
        action: 'handleProgressBarClick',
        name: 'roundNewCurrentTime',
        value: time
      });
    }
  }

  getMediaCurrentTime = () => {
    if (this.videoRef.current !== null) {
      return secondsToTimecode(this.videoRef.current.currentTime + this.state.timecodeOffset);
    }

    return '00:00:00:00';
  }
  handleMediaDurationChange =(e) => {
    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: 'MediaPlayer',
        action: 'mediaDuration',
        name: secondsToTimecode(e.target.duration),
        value: e.target.duration
      });
    }
  }

  onLoadedDataGetDuration = (e) => {
    const currentDuration = e.target.duration;
    const currentDurationWithOffset = currentDuration+ this.state.timecodeOffset;
    const durationInSeconds = secondsToTimecode( currentDuration+ currentDurationWithOffset);

    this.setState({
      mediaDuration: durationInSeconds
    });

    if (this.props.handleAnalyticsEvents !== undefined) {
      this.props.handleAnalyticsEvents({
        category: 'MediaPlayer',
        action: 'onLoadedDataGetDuration',
        name: 'durationInSeconds-WithoutOffset',
        value: secondsToTimecode( currentDuration)
      });
    }

  }

  handlePictureInPicture = () => {
    if (this.videoRef.current !== null) {
      if (document.pictureInPictureElement !== undefined) {
      // from https://developers.google.com/web/updates/2017/09/picture-in-picture
        if (!document.pictureInPictureElement) {

          this.props.handleAnalyticsEvents({
            category: 'MediaPlayer',
            action: 'handlePictureInPicture',
            name: 'turning-picture-in-picture-on'
          });

          this.videoRef.current.requestPictureInPicture()
            .catch(error => {
              // Video failed to enter Picture-in-Picture mode.
              console.error('Video failed to enter Picture-in-Picture mode', error);

              this.props.handleAnalyticsEvents({
                category: 'MediaPlayer',
                action: 'handlePictureInPicture',
                name: 'turning-picture-in-picture-on-error'
              });

            });

        } else {
          this.props.handleAnalyticsEvents({
            category: 'MediaPlayer',
            action: 'handlePictureInPicture',
            name: 'turning-picture-in-picture-off'
          });
          document.exitPictureInPicture()
            .catch(error => {
              // Video failed to leave Picture-in-Picture mode.
              console.error('Video failed to leave Picture-in-Picture mode', error);

              this.props.handleAnalyticsEvents({
                category: 'MediaPlayer',
                action: 'handlePictureInPicture',
                name: 'turning-picture-in-picture-off-error'
              });
            });
        }
      } else {
        alert('Picture in Picture not supported in this browser, try chrome.');

        this.props.handleAnalyticsEvents({
          category: 'MediaPlayer',
          action: 'handlePictureInPicture',
          name: 'picture-in-picture-not-supported'
        });

      }
    }
  }

  render() {
    const player = <VideoPlayer
      mediaUrl={ this.props.mediaUrl }
      onTimeUpdate= { this.handleTimeUpdate }
      onClick= { this.togglePlayMedia.bind(this) }
      videoRef={ this.videoRef }
      onLoadedDataGetDuration={ this.onLoadedDataGetDuration }
    />;

    const playerControlsSection = (
      <div className={ styles.controlsSection }>
        <div className={ styles.titleBox }>
          <h1 className={ styles.title }>{ this.props.fileName? this.props.fileName : this.props.mediaUrl }</h1>
        </div>
        <PlayerControls
          playMedia={ this.togglePlayMedia.bind(this) }
          isPlaying={ this.state.isPlaying }
          playbackRate={ this.state.playbackRate }
          skipBackward={ this.skipBackward.bind(this) }
          skipForward={ this.skipForward.bind(this) }
          rollback={ this.rollBack }
          currentTime={ this.getMediaCurrentTime() }
          duration={ this.state.mediaDuration }
          onSetCurrentTime={ '' }
          onSetTimecodeOffset={ '' }
          promptSetCurrentTime={ this.promptSetCurrentTime.bind(this) }
          setTimeCodeOffset={ this.setTimeCodeOffset.bind(this) }
          timecodeOffset={ secondsToTimecode(this.state.timecodeOffset) }
          handleMuteVolume={ this.handleMuteVolume.bind(this) }
          setPlayBackRate={ this.handlePlayBackRateChange.bind(this) }
          playbackRateOptions={ this.state.playbackRateOptions }
          pictureInPicture={ this.handlePictureInPicture }
          handleSaveTranscript={ () => {this.props.handleSaveTranscript();} }
        />
      </div>
    );

    const progressBar = <ProgressBar
      max={ this.videoRef.current !== null ? parseInt(this.videoRef.current.duration).toString() : '100' }
      value={ this.videoRef.current !== null ? parseInt(this.videoRef.current.currentTime) : 0 }
      buttonClick={ this.handleProgressBarClick.bind(this) }
    />;

    return (
      <section className={ styles.topSection }>
        <div className={ styles.playerSection }>
          { this.props.mediaUrl !== null ? player : null }
          { this.props.mediaUrl !== null ? playerControlsSection : null }
        </div>
        { this.props.mediaUrl !== null ? progressBar : null }
      </section>
    );
  }
}

MediaPlayer.propTypes = {
  fileName: PropTypes.string,
  hookSeek: PropTypes.func,
  hookPlayMedia: PropTypes.func,
  hookIsPlaying: PropTypes.func,
  mediaUrl: PropTypes.string,
  hookOnTimeUpdate: PropTypes.func,
  rollBackValueInSeconds: PropTypes.number,
  timecodeOffset: PropTypes.number
};

export default hotkeys(MediaPlayer);
