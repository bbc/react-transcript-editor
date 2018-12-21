import React from 'react';
import PropTypes from 'prop-types';
import styles from './VolumeControl.module.css';
class VolumeControl extends React.Component {

  render() {
    return (
      <div className={ styles.switchContainer }>
        <label className={ styles.switch }>
          <input type="checkbox"
            defaultChecked="true"
            onChange={ this.props.handleMuteVolume }
          />
          <span className={ styles.slider }></span>
        </label>
        <label className={ styles.label }>Volume</label>
      </div>
    );
  }
}

VolumeControl.propTypes = {
  handleMuteVolume: PropTypes.func
};

export default VolumeControl;
