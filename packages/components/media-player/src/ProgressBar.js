import React from 'react';
import PropTypes from 'prop-types';

import style from './ProgressBar.module.scss';

class ProgressBar extends React.Component {

  shouldComponentUpdate = (nextProps) => {
    return nextProps !== this.props;
  }

  handleOnChange = (e) => {
    this.props.buttonClick(e);
  }

  render() {
    return (
      <div className={ style.wrapper }>
        <input
          type='range'
          className={ style.bar }
          onChange={ this.handleOnChange }
          value={ this.props.value }
          min='0'
          max={ this.props.max.toString() }
        />
      </div>
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
