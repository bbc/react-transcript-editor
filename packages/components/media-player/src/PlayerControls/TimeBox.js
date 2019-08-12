import React from 'react';
import style from './index.module.css';

class TimeBox extends React.Component {

  shouldComponentUpdate(nextProps) {
    if (nextProps !== this.props) {
      return true;
    }

    return false;
  }

  // as separate function above render for performance
  handleClick = (e) => {
    this.props.promptSetCurrentTime(e);
  }
  render() {
    return (
      <div className={ style.timeBox }>
        <span
          title="Current time: alt t"
          className={ style.currentTime }
          onClick={ this.handleClick }>
          { this.props.currentTime }</span>
        <span className={ style.separator }>|</span>
        <span
          title="Clip duration"
          className={ style.duration }>
          {this.props.duration}</span>
      </div>
    );
  }
}

export default TimeBox;
