import React from 'react';
import PropTypes from 'prop-types';

class PlayerControls extends React.Component {
    // to handle backward and forward mouse pressed on btn
    // set a 300 ms  interval to repeat the 
    // backward or forward function
    // on mouseUp the interval is cleared
    setIntervalHelperBackward =() => {
       this.interval =  setInterval(() => {
                this.props.skipBackward();
        }, 300);       
    }

    setIntervalHelperForward =() => {
        this.interval =  setInterval(() => {
                 this.props.skipForward();
         }, 300);       
     }

    clearIntervalHelper = () => {
        clearInterval( this.interval);
    }

    setTimecodeOffSetHelper = () => {
        this.props.setTimeCodeOffset( prompt('Add a timecode offset hh:mm:ss:ff'))
    }

    render() {
        return (
          <div>
            {/* Play Btn  */}
            <button onClick={ (e) => { this.props.playMedia(e) } }> {this.props.isPlaying() ? '❚❚' : '▶'} </button> 
            {/* Backward Btn */}
            <button 
                onMouseDown={ this.setIntervalHelperBackward }
                onMouseUp={ this.clearIntervalHelper }
            > {'◀◀'}
            </button>
            {/* Forward Btn */}
            <button 
                onMouseDown={ this.setIntervalHelperForward }
                onMouseUp={ this.clearIntervalHelper }
            > {'▶▶'} 
            </button> 
            <br/>
            {/* Timecodes  */}
            <code>{this.props.currentTime}</code> / <code>{this.props.duration}</code>
            <br/>
            <button type="button" 
                onClick={ this.props.promptSetCurrentTime }
            >Jump To Time ⏱</button> 
            <br/>
            <button type="button" 
                onClick={ this.setTimecodeOffSetHelper }
                >Set Timecode Offset ⏱</button>
            <output><code>{this.props.timecodeOffset}</code></output>     
          </div>
        );
    }
}

PlayerControls.propTypes = {
    playMedia: PropTypes.func,
    currentTime: PropTypes.string,
    timecodeOffset: PropTypes.string,
    promptSetCurrentTime: PropTypes.func
  };

export default PlayerControls;