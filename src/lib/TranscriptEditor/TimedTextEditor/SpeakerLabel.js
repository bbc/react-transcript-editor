import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';

import style from './WrapperBlock.module.css';

class SpeakerLabel extends PureComponent {
  render() {
    return (
      <span className={ style.speaker }>
        <span
          className={ style.EditLabel }
          onClick={ this.props.handleOnClickEdit }>
          <FontAwesomeIcon icon={ faUserEdit } />
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
