import React from 'react';
import PropTypes from 'prop-types';
// import styles from './PlaybackRate.module.css';
import Select from './Select';
import style from './PlayerControls/index.module.css';

class PlaybackRate extends React.Component {

  // to avoid unnecessary re-renders
  shouldComponentUpdate(nextProps) {
    if (nextProps.playbackRate !== this.props.playbackRate) {
      return true;
    }

    return false;
  }
  render() {
    return (
      <span className={ style.playBackRate }
        title="Playback rate: alt - & alt + ">
        <Select
          options={ this.props.playbackRateOptions }
          currentValue={ this.props.playbackRate.toString() }
          name={ 'playbackRate' }
          handleChange={ this.props.handlePlayBackRateChange }
        />
      </span>
    );
  }
}

PlaybackRate.propTypes = {
  playbackRateOptions: PropTypes.array,
  playbackRate: PropTypes.number,
  handlePlayBackRateChange: PropTypes.func
};

export default PlaybackRate;
