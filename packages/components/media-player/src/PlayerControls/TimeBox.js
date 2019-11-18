import React from "react";
import isEqual from "react-fast-compare";

import style from "./index.module.scss";

class TimeBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewportWidth:  document.documentElement.clientWidth
    };
  }
  // https://stackoverflow.com/questions/28405444/inline-css-styles-in-react-how-to-implement-media-queries
  componentDidMount = () => {
    window.addEventListener("resize", this._resize_mixin_callback);
    // this.setState({
    //   viewportWidth: document.documentElement.clientWidth
    // });
  };
  _resize_mixin_callback = () => {
    this.setState({
      viewportWidth: document.documentElement.clientWidth
    });
  };
  componentWillUnmount = () => {
    window.removeEventListener("resize", this._resize_mixin_callback);
  };

  // shouldComponentUpdate = nextProps => {
    // return !isEqual(this.props, nextProps);
  // };

  handleClick = e => {
    this.props.promptSetCurrentTime(e);
  };

  render() {
    let customStyleCurrentTime;
    let customStyleSeparator;
    let customStyleDuration;
    let customBackgroundColor;
    if (this.props.customStyles) {
      const timeboxColor = this.props.customStyles.mediaPlayer.timeBox;
      const currentTimeColor = timeboxColor.currentTime;
      const separatorColor = timeboxColor.separator;
      const durationTimeColor = timeboxColor.durationTime;
      const backgroundColor = this.props.customStyles.mediaPlayer.btn
        .backgroundColor;
      customStyleCurrentTime = { color: currentTimeColor };
      customStyleSeparator = { color: separatorColor };
      customStyleDuration = { color: durationTimeColor };
      if (this.state.viewportWidth > 768) {
        customBackgroundColor = { background: backgroundColor };
      }
    }
    return (
      <div className={style.timeBox} style={customBackgroundColor}>
        <span
          title="Current time: alt t"
          className={style.currentTime}
          style={customStyleCurrentTime}
          onClick={this.handleClick}
        >
          {this.props.currentTime}
        </span>
        <span className={style.separator} style={customStyleSeparator}>
          |
        </span>
        <span
          title="Clip duration"
          className={style.duration}
          style={customStyleDuration}
        >
          {this.props.duration}
        </span>
      </div>
    );
  }
}

export default TimeBox;
