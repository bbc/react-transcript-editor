import React from 'react';
import PropTypes from 'prop-types';

import style from './ProgressBar.module.css';

class ProgressBar extends React.Component {

  // performance optimization
  shouldComponentUpdate = (nextProps) => {
    if (nextProps.buttonClick !== this.props.buttonClick) {
      return true;
    }

    if (nextProps.value !== this.props.value) {
      return true;
    }

    if (nextProps.max !== this.props.max) {
      return true;
    }

    return false;
  }
  // performance optimization
  handleOnChange = (e) => {
    this.props.buttonClick(e);
  }

  render() {
    return (
      <input
        type='range'
        className={ style.bar }
        onChange={ this.handleOnChange }
        value={ this.props.value }
        min='0'
        max={ this.props.max.toString() }
      />
    );
  }
}

ProgressBar.propTypes = {
  value: PropTypes.number,
  max: PropTypes.string,
  buttonClick: PropTypes.func
};

export default ProgressBar;
