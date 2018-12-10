import React from 'react';
import PropTypes from 'prop-types';

import VolumeControl from './VolumeControl';

import style from './PlayerControls.module.css';

class PlayerControls extends React.Component {
  // to handle backward and forward mouse pressed on btn
  // set a 300 ms  interval to repeat the
  // backward or forward function
  // on mouseUp the interval is cleared
  setIntervalHelperBackward = () => {
    this.interval = setInterval(() => {
      this.props.skipBackward();
    }, 300);
  }

  setIntervalHelperForward = () => {
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
          onClick={ (e) => { this.props.playMedia(e); } }>
          {this.props.isPlaying() ? '❚❚' : '▶'}
        </button>

        <button
          className={ style.playerButton }
          onMouseDown={ this.setIntervalHelperForward }
          onMouseUp={ this.clearIntervalHelper }>
          {'▶▶'}
        </button>

        <div className={ style.timeBox }>
          <span className={ style.currentTime }>{ this.props.currentTime }</span>
          <span className={ style.separator }>|</span>
          <span className={ style.duration }>{this.props.duration}</span>
        </div>

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
  handleMuteVolume: PropTypes.handleMuteVolume
};

export default PlayerControls;
