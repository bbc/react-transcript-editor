import React from 'react';
import PropTypes from 'prop-types';

import VolumeControl from './VolumeControl';
import Select from './Select';

import style from './PlayerControls.module.css';

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
          {'↺'}
        </button>

        <button
          className={ style.playerButton }
          onMouseDown={ this.setIntervalHelperBackward }
          onMouseUp={ this.clearIntervalHelper }>
          {'◀◀'}
        </button>

        <button
          className={ style.playerButton }
          onClick={ this.props.playMedia }>
          {this.props.isPlaying ? '❚❚' : '▶'}
        </button>

        <button
          className={ style.playerButton }
          onMouseDown={ this.setIntervalHelperForward }
          onMouseUp={ this.clearIntervalHelper }>
          {'▶▶'}
        </button>

        <button
          className={ style.playBackRate }>
          x<Select
            options={ this.props.playbackRateOptions }
            currentValue={ this.props.playbackRate.toString() }
            name={ 'playbackRate' }
            handleChange={ this.props.setPlayBackRate }
          />

        </button>

        <div className={ style.timeBox }>
          <span className={ style.currentTime }
            onClick={ this.props.promptSetCurrentTime }
          >{ this.props.currentTime }</span>
          <span className={ style.separator }>|</span>
          <span className={ style.duration }>{this.props.duration}</span>
        </div>

        <VolumeControl
          handleMuteVolume={ this.props.handleMuteVolume }
        />

        <div style={ {
          color: 'white',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap',
          'overflow': 'hidden',
          'width': '40vw',
          'display': 'inline-block',
          'margin-left': '1em'
        } }>
          {this.props.title}
        </div>

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
  setPlayBackRate: PropTypes.func
};

export default PlayerControls;
