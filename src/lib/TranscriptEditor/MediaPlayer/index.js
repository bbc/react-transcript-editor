import React from 'react';
import PropTypes from 'prop-types';
import { hotkeys } from 'react-keyboard-shortcuts';

import VideoPlayer from './VideoPlayer';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';

import returnHotKeys from './defaultHotKeys';
import styles from './index.module.css';

import { secondsToTimecode, timecodeToSeconds } from '../../Util/timecode-converter/index';

class MediaPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();

    this.state = {
      playBackRate: 1,
      rollBackValueInSeconds: 15,
      timecodeOffset: 0,
      hotKeys: returnHotKeys(this),
      isPlaying: false
    };
  }
  /*eslint-disable camelcase */
  hot_keys = returnHotKeys(this);

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

  promptSetCurrentTime = () => {
    this.setCurrentTime( prompt('Jump to time - hh:mm:ss:ff hh:mm:ss mm:ss m:ss m.ss seconds'));
  }

  setTimeCodeOffset = (newTimeCodeOffSet) => {
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
      // get video duration
      const videoElem = this.videoRef.current;
      const tmpDesiredCurrentTime = videoElem.currentTime - this.state.rollBackValueInSeconds;
      // > 0 < duration of video
      this.setCurrentTime(tmpDesiredCurrentTime);
    }
  }

  handleTimeUpdate = (e) => {
    // eslint-disable-next-line react/prop-types
    this.props.hookOnTimeUpdate(e.target.currentTime);
  }

  handlePlayBackRateChange = (e) => {
    this.setPlayBackRate(e.target.value);
  }

  getCurrentPlaybackRate = () => {
    if (this.videoRef.current !== null) {
      return this.videoRef.current.playbackRate;
    }
  }

  setPlayBackRate = (speedValue) => {
    // value between 0.2 and 3.5
    if (this.videoRef.current !== null) {
      if (speedValue >= 0.2 && speedValue <= 3.5) {
        this.setState({
          playBackRate: speedValue,
        }, () => {
          this.videoRef.current.playbackRate = speedValue;
        });
      }
    }
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
  }

  playMedia = () => {
    this.setState({ isPlaying: true }, () => this.videoRef.current.play());
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
      const currentTime = this.videoRef.current.currentTime;
      const newCurrentTimeIncreased = currentTime + 10;
      const newCurrentTime = Number((newCurrentTimeIncreased).toFixed(1));
      this.setCurrentTime(newCurrentTime);
    }
  }

  skipBackward = () => {
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
  }

  getMediaCurrentTime = () => {
    if (this.videoRef.current !== null) {
      return secondsToTimecode(this.videoRef.current.currentTime + this.state.timecodeOffset);
    }

    return '00:00:00:00';
  }

  getMediaDuration = () => {
    if (this.videoRef.current !== null) {
      return secondsToTimecode(this.videoRef.current.duration + this.state.timecodeOffset);
    }

    return '00:00:00:00';
  }

  render() {
    const player = <VideoPlayer
      mediaUrl={ this.props.mediaUrl }
      onTimeUpdate= { this.handleTimeUpdate }
      onClick= { this.togglePlayMedia.bind(this) }
      videoRef={ this.videoRef }
    />;

    const playerControlsSection = (
      <div className={ styles.controlsSection }>
        <div className={ styles.titleBox }>
          <h1 className={ styles.title }>{ this.props.mediaUrl }</h1>
        </div>
        <PlayerControls
          playMedia={ this.togglePlayMedia.bind(this) }
          isPlaying={ this.state.isPlaying }
          skipBackward={ this.skipBackward.bind(this) }
          skipForward={ this.skipForward.bind(this) }
          rollback={ this.rollBack }
          currentTime={ this.getMediaCurrentTime() }
          duration={ this.getMediaDuration() }
          onSetCurrentTime={ '' }
          onSetTimecodeOffset={ '' }
          promptSetCurrentTime={ this.promptSetCurrentTime.bind(this) }
          setTimeCodeOffset={ this.setTimeCodeOffset.bind(this) }
          timecodeOffset={ secondsToTimecode(this.state.timecodeOffset) }
          handleMuteVolume={ this.handleMuteVolume.bind(this) }
        />
      </div>
    );

    const progressBar = <ProgressBar
      max={ this.videoRef.current !== null ? parseInt(this.videoRef.current.duration) : 100 }
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
  hookSeek: PropTypes.func,
  hookPlayMedia: PropTypes.func,
  hookIsPlaying: PropTypes.func,
  mediaUrl: PropTypes.string,
  hookOnTimeUpdate: PropTypes.func,
};

export default hotkeys(MediaPlayer);
