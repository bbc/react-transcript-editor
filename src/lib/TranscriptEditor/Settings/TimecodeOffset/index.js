import React from 'react';
import PropTypes from 'prop-types';
// import styles from '../index.module.css';
import { timecodeToSeconds, secondsToTimecode } from '../../../Util/timecode-converter/index';

class TimecodeOffset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timecodeOffset: secondsToTimecode(this.props.timecodeOffset)
    };
  }
    handleChange = (e) => {
      console.log( e.target.value);
     
      this.setState({
        timecodeOffset: e.target.value
      });
    }

    resetTimecodeOffset = () => {
      const resetTimecodeOffsetValue = '00:00:00:00';
      this.setState({
        timecodeOffset: resetTimecodeOffsetValue
      },() => {
        this.props.handleSetTimecodeOffset(resetTimecodeOffsetValue);
      });
    }

    setTimecodeOffset = () => {
      console.log(this.state.timecodeOffset);
      let newCurrentTimeInSeconds = this.state.timecodeOffset;
      if (typeof newCurrentTimeInSeconds ==='string' 
      && newCurrentTimeInSeconds.includes(':')
      && !newCurrentTimeInSeconds.includes('NaN')) {
        newCurrentTimeInSeconds = timecodeToSeconds(newCurrentTimeInSeconds );
      }
      this.props.handleSetTimecodeOffset(newCurrentTimeInSeconds);
    }

    render() {
      return (
        <div >
          <label>Timecode Offset ℹ </label>
          <input 
            type="text" 
            value={ this.state.timecodeOffset } 
            onChange={ this.handleChange }
            name="lname"/>
          <small onClick={ this.resetTimecodeOffset }><u>Reset</u></small> | 
          <small onClick={ this.setTimecodeOffset }><u>Save</u></small>
        </div>
      );
    }
}

TimecodeOffset.propTypes = {
  handleSetTimecodeOffset: PropTypes.func,
  onChange: PropTypes.func
};

export default TimecodeOffset;
