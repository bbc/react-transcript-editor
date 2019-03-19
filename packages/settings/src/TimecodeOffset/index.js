import React from "react";
import PropTypes from "prop-types";
import {
  timecodeToSeconds,
  secondsToTimecode
} from "@bbc-transcript-editor/util-timecode-converter";

import style from "./index.module.css";

class TimecodeOffset extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timecodeOffset: secondsToTimecode(this.props.timecodeOffset)
    };
  }

  handleChange = e => {
    this.setState({
      timecodeOffset: e.target.value
    });
  };

  resetTimecodeOffset = () => {
    const resetTimecodeOffsetValue = 0;

    this.props.handleAnalyticsEvents({
      category: "TimecodeOffset",
      action: "resetTimecodeOffset",
      name: "resetTimecodeOffset",
      value: 0
    });

    this.setState(
      {
        timecodeOffset: secondsToTimecode(resetTimecodeOffsetValue)
      },
      () => {
        this.props.handleSetTimecodeOffset(resetTimecodeOffsetValue);
      }
    );
  };

  setTimecodeOffset = () => {
    this.props.handleAnalyticsEvents({
      category: "TimecodeOffset",
      action: "setTimecodeOffset",
      name: "setTimecodeOffset",
      value: this.state.timecodeOffset
    });

    let newCurrentTimeInSeconds = this.state.timecodeOffset;
    if (
      typeof newCurrentTimeInSeconds === "string" &&
      newCurrentTimeInSeconds.includes(":") &&
      !newCurrentTimeInSeconds.includes("NaN")
    ) {
      newCurrentTimeInSeconds = timecodeToSeconds(newCurrentTimeInSeconds);
    }
    this.props.handleSetTimecodeOffset(newCurrentTimeInSeconds);
  };

  render() {
    return (
      <div className={style.offsetContainer}>
        <input
          className={style.inputBox}
          type="text"
          value={this.state.timecodeOffset}
          onChange={this.handleChange}
          name="lname"
        />
        <span className={style.button} onClick={this.resetTimecodeOffset}>
          <u>Reset</u>
        </span>
        <span> | </span>
        <span className={style.button} onClick={this.setTimecodeOffset}>
          <u>Save</u>
        </span>
      </div>
    );
  }
}

TimecodeOffset.propTypes = {
  handleSetTimecodeOffset: PropTypes.func,
  onChange: PropTypes.func,
  timecodeOffset: PropTypes.number,
  handleAnalyticsEvents: PropTypes.func
};

export default TimecodeOffset;
