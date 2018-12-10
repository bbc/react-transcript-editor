import React from 'react';
import PropTypes from 'prop-types';
import styles from './VolumeControl.module.css';
class PauseWhileTyping extends React.Component {

  render() {
    return (
      <div>
        <p className={ styles.helpText }>Pause While Typing</p>
        <label className={ styles.switch }>
          <input type="checkbox"
            defaultChecked={ this.props.isPausedWhileTyping }
            onChange={ this.props.handleToggle }
          />
          <span className={ styles.slider }></span>
        </label>
      </div>
    );
  }
}

PauseWhileTyping.propTypes = {
  handleToggle: PropTypes.func
};

export default PauseWhileTyping;
