import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';

import style from './WrapperBlock.module.css';

class SpeakerLabel extends PureComponent {
  render() {
    return (
      <span className={ this.props.isEditable? [style.speaker, style.speakerEditable].join(' '):  [style.speaker, style.speakerNotEditable].join(' ')}
        title={ this.props.name }
        onClick={ this.props.isEditable? this.props.handleOnClickEdit: null } >
        <span className={ style.EditLabel }>
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
