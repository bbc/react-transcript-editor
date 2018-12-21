import React from 'react';
import PropTypes from 'prop-types';

import style from './index.module.css';

class Toggle extends React.Component {
  render() {
    return (
      <div className={ style.switchContainer }>
        <label className={ style.switch }>
          <input type='checkbox'
            defaultChecked={ this.props.defaultValue }
            onChange={ this.props.handleToggle }
          />
          <span className={ style.slider }></span>
        </label>
      </div>
    );
  }
}

Toggle.propTypes = {
  handleToggle: PropTypes.func,
  label: PropTypes.string,
  defaultValue: PropTypes.bool
};

export default Toggle;
