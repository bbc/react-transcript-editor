import React from 'react';
import PropTypes from 'prop-types';

import style from './ProgressBar.module.css';

class ProgressBar extends React.Component {

  render() {
    return (
      <input
        type='range'
        className={ style.bar }
        onChange={ this.props.buttonClick }
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
