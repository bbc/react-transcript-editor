import React from 'react';
import PropTypes from 'prop-types';
import styles from './VolumeControl.module.css';
class VolumeControl extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
          <div>
            <p className={ styles.helpText }>Volume</p>
            <label className={ styles.switch }>
              <input type="checkbox"
                defaultChecked="true"
                onChange={ this.props.handleMuteVolume }
                />
              <span className={ styles.slider }></span>
            </label>
          </div>
        );
    }
}

export default VolumeControl;