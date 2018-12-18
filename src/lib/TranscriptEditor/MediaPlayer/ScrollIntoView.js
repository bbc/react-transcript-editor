import React from 'react';
import PropTypes from 'prop-types';
import styles from './VolumeControl.module.css';
class ScrollIntoView extends React.Component {

  render() {
    return (
      <div>
        <p className={ styles.helpText }>ScrollIntoView</p>
        <label className={ styles.switch }>
          <input type="checkbox"
            defaultChecked={ this.props.isScrollIntoViewOn }
            onChange={ this.props.handleToggle }
          />
          <span className={ styles.slider }></span>
        </label>
      </div>
    );
  }
}

ScrollIntoView.propTypes = {
  handleToggle: PropTypes.func,
  isScrollIntoViewOn: PropTypes.bool
};

export default ScrollIntoView;
