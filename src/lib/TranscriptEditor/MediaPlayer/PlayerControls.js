import React from 'react';
import PropTypes from 'prop-types';
import VolumeControl from './VolumeControl';
import Select from './Select';

import style from './PlayerControls.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faSave,
  faTv,
  faPlay,
  faPause,
  faBackward,
  faForward,
  faUndo
} from '@fortawesome/free-solid-svg-icons';

class PlayerControls extends React.Component {
  // to handle backward and forward mouse pressed on btn
  // set a 300 ms  interval to repeat the
  // backward or forward function
  // on mouseUp the interval is cleared
  setIntervalHelperBackward = () => {
    this.props.skipBackward();
    this.interval = setInterval(() => {
      this.props.skipBackward();
    }, 300);
  }

  setIntervalHelperForward = () => {
    this.props.skipForward();
    this.interval = setInterval(() => {
      this.props.skipForward();
    }, 300);
  }

  clearIntervalHelper = () => {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className={ style.playerControls }>
        <button
          className={ style.playerButton }
          onClick={ this.props.rollback }>
          <FontAwesomeIcon icon={ faUndo } />
        </button>

        <button
          className={ style.playerButton }
          onMouseDown={ this.setIntervalHelperBackward }
          onMouseUp={ this.clearIntervalHelper }>
          <FontAwesomeIcon icon={ faBackward } />

        </button>

        <button
          className={ style.playerButton }
          onClick={ this.props.playMedia }>
          {this.props.isPlaying ? <FontAwesomeIcon icon={ faPause } /> : <FontAwesomeIcon icon={ faPlay } />}
        </button>

        <button
          className={ style.playerButton }
          onMouseDown={ this.setIntervalHelperForward }
          onMouseUp={ this.clearIntervalHelper }>
          <FontAwesomeIcon icon={ faForward } />
        </button>

        <span className={ style.playBackRate }>
          <Select
            options={ this.props.playbackRateOptions }
            currentValue={ this.props.playbackRate.toString() }
            name={ 'playbackRate' }
            handleChange={ this.props.setPlayBackRate } />
        </span>

        <div className={ style.timeBox }>
          <span className={ style.currentTime }
            onClick={ this.props.promptSetCurrentTime }
          >{ this.props.currentTime }</span>
          <span className={ style.separator }>|</span>
          <span className={ style.duration }>{this.props.duration}</span>
        </div>

        <button
          className={ style.playerButton }
          onClick={ this.props.handleSaveTranscript }>
          <FontAwesomeIcon icon={ faSave } />
        </button>

        <button
          className={ style.playerButton }
          onClick={ this.props.pictureInPicture }
        >
          <FontAwesomeIcon icon={ faTv } />
        </button>

        <VolumeControl
          handleMuteVolume={ this.props.handleMuteVolume }
        />
      </div>
    );
  }
}

PlayerControls.propTypes = {
  playMedia: PropTypes.func,
  currentTime: PropTypes.string,
  timecodeOffset: PropTypes.string,
  promptSetCurrentTime: PropTypes.func,
  rollback: PropTypes.func,
  handleMuteVolume: PropTypes.func,
  duration: PropTypes.string,
  isPlaying: PropTypes.bool,
  skipBackward: PropTypes.func,
  skipForward: PropTypes.func,
  playbackRate: PropTypes.number,
  playbackRateOptions: PropTypes.array,
  setPlayBackRate: PropTypes.func,
  pictureInPicture: PropTypes.func
};

export default PlayerControls;
