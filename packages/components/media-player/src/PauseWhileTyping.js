import React from 'react';
import PropTypes from 'prop-types';

class PauseWhileTyping extends React.Component {
  render() {
    return (
      <div>
        <p>Pause While Typing</p>
        <label>
          <input type="checkbox"
            defaultChecked={ this.props.isPauseWhileTypingOn }
            onChange={ this.props.handleToggle }
          />
        </label>
      </div>
    );
  }
}

PauseWhileTyping.propTypes = {
  handleToggle: PropTypes.func,
  isPauseWhileTypingOn: PropTypes.bool
};

export default PauseWhileTyping;
