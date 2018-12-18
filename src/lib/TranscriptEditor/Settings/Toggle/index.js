import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.css';
class Toggle extends React.Component {

  render() {
    return (
      <div className={ styles.switchContainer }>
        <label className={ styles.switch }>
          <input type="checkbox"
            defaultChecked={ this.props.defaultValue }
            onChange={ this.props.handleToggle }
          />
          <span className={ styles.slider }></span>
        </label>
        {/* <label className={ styles.label }>{this.props.label}</label> */}
      </div>
    );
  }
}

Toggle.propTypes = {
  handleToggle: PropTypes.func,
  label: PropTypes.string
};

export default Toggle;
