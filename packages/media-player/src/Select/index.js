import React from "react";
import PropTypes from "prop-types";

import style from "./index.module.css";

class Select extends React.Component {
  render() {
    const options = this.props.options.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ));

    return (
      <select
        className={style.selectPlayerControl}
        name={this.props.name}
        value={this.props.currentValue}
        onChange={this.props.handleChange}
      >
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
