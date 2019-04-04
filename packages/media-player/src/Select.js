import React from 'react';
import PropTypes from 'prop-types';

import style from './Select.module.css';

class Select extends React.Component {

  render() {
    const options = this.props.options.map((option, index) => {
      // eslint-disable-next-line react/no-array-index-key
      return <option key={ index } value={ option.value }>{option.label}</option>;
    });

    return (
      <select className={ style.selectPlayerControl } name={ this.props.name } value={ this.props.currentValue } onChange={ this.props.handleChange }>
        {options}
      </select>
    );
  }
}

Select.propTypes = {
  options: PropTypes.array,
  name: PropTypes.string,
  currentValue: PropTypes.string,
  handleChange: PropTypes.func
};

export default Select;
