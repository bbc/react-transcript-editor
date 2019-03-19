import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import style from "./index.module.css";

class SpeakerLabel extends PureComponent {
  render() {
    return (
      <span className={style.speaker} onClick={this.props.handleOnClickEdit}>
        <span className={style.EditLabel}>
          <FontAwesomeIcon icon="user-edit" />
        </span>
        {this.props.name}
      </span>
    );
  }
}

SpeakerLabel.propTypes = {
  name: PropTypes.string,
  handleOnClickEdit: PropTypes.func
};

export default SpeakerLabel;
