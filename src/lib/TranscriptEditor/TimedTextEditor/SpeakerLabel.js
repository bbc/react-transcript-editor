import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import style from './WrapperBlock.module.css';

class SpeakerLabel extends PureComponent {
    render() {
      return (
        <div className="SpeakerBlock">
          {this.props.name}
          <span
            className={ style.EditLabel }
            onClick={ this.props.handleOnClickEdit }> ✏️
          </span>
        </div>
      )
    }
}

SpeakerLabel.propTypes = {
  name: PropTypes.string,
  handleOnClickEdit: PropTypes.func
};

export default SpeakerLabel;
