import React from 'react';
import PropTypes from 'prop-types';
import styles from './PlaybackRate.module.css';
class PlaybackRate extends React.Component {

  render() {
    return (
      <div>
        <p className={ styles.helpText }>Playback Rate
          <output className={ styles.playbackRateValue } >{ ` x${ this.props.playBackRate } ` }</output>
        </p>
        <input
          type="range"
          min="0.2"
          value={ this.props.playBackRate }
          max="3.5"
          step="0.1"
          onChange={ this.props.handlePlayBackRateChange }
        />
        <br/>
        <button type="button" onClick={ () => { this.props.setPlayBackRate(1); } }>Reset Playback Rate</button>
      </div>
    );
  }
}

PlaybackRate.propTypes = {
  handlePlayBackRateChange: PropTypes.func,
  playBackRate: PropTypes.number,
  setPlayBackRate: PropTypes.func
};

export default PlaybackRate;
