import React from "react";
import PropTypes from "prop-types";

import style from "./Select.module.scss";
import { irBlack } from "react-syntax-highlighter/dist/styles/hljs";

class Select extends React.Component {
  render() {
    const options = this.props.options.map((option, index) => {
      // eslint-disable-next-line react/no-array-index-key
      return (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      );
    });
    console.log("Select this.props.customStyles", this.props.customStyles);
    return (
      <>
        <style scoped>
          {`.selectPlayerControl[name='playbackRate'] {
            color: ${ this.props.customStyles ? this.props.customStyles.color : null };
            background: ${ this.props.customStyles ? this.props.customStyles.background: null };
          }`}
        </style>
        <select
          className={[style.selectPlayerControl, "selectPlayerControl"].join(" ")}
          style={this.props.customStyles}
          name={this.props.name}
          value={this.props.currentValue}
          onChange={this.props.handleChange}
        >
          {options} V
        </select>
      </>
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
