import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class SpeakerLabel extends PureComponent {
    render() {
      return (
        <span className="SpeakerBlock">
          {this.props.name}

          <span onClick={ this.props.handleOnClickEdit }> ✏️</span>
        </span>
      )
    }
}

SpeakerLabel.propTypes = {
  name: PropTypes.string,
  handleOnClickEdit: PropTypes.func
};

export default SpeakerLabel;
