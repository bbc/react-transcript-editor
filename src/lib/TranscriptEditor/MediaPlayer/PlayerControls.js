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
          x <Select
            options={ [ { value:'0.25',label:'0.25' },
              { value:'0.5',label:'0.5' },
              { value:'0.75',label:'0.75' },
              { value:'1',label:'1' },
              { value:'1.25',label:'1.25' },
              { value:'1.5',label:'1.5' },
              { value:'1.75',label:'1.75' },
              { value:'2',label:'2' },
              { value:'2.5',label:'2.5' },
              { value:'3',label:'3' },
              { value:'3.5',label:'3.5' } ] }
            currentValue={ this.props.playBackRate.toString() }
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

        {/* <VolumeControl
          handleMuteVolume={ this.props.handleMuteVolume }
        /> */}
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
  skipForward: PropTypes.func
};

export default PlayerControls;
