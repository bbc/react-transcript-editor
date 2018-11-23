import React from 'react';
import PropTypes from 'prop-types';
import styles from './PlaybackRate.module.css';
class PlaybackRate extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
          <div>
            <p className={ styles.helpText }>Playback Rate
              <b> <output >{ `x${ this.props.playBackRate }` }</output> </b>
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
            <button type="button" onClick={ () => { this.props.setPlayBackRate(1) } }>Reset Playback Rate</button>
          </div>
        );
    }
}

export default PlaybackRate;