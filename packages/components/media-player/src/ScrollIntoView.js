import React from 'react';
import PropTypes from 'prop-types';

class ScrollIntoView extends React.Component {
  render() {
    return (
      <div>
        <p>ScrollIntoView</p>
        <label>
          <input type="checkbox"
            defaultChecked={ this.props.isScrollIntoViewOn }
            onChange={ this.props.handleToggle }
          />
        </label>
      </div>
    );
  }
}

ScrollIntoView.propTypes = {
  handleToggle: PropTypes.func,
  isScrollIntoViewOn: PropTypes.bool
};

export default ScrollIntoView;
