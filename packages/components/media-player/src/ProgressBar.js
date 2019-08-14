import React from 'react';
import PropTypes from 'prop-types';

import style from './ProgressBar.module.css';

class ProgressBar extends React.Component {

  // performance optimization
  shouldComponentUpdate = (nextProps) => {
    if (nextProps !== this.props) {
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

ProgressBar.defaultProps = {
  value: '0',
  max: '0',
};

export default ProgressBar;
