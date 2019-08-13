import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Word extends Component {

  shouldComponentUpdate(nextProps) {
    if ( nextProps.decoratedText !== this.props.decoratedText) {
      return true;
    }

    return false;
  }

  generateConfidence = (data) => {
    // handling edge case where confidence score not present
    if (data.confidence) {
      return data.confidence > 0.6 ? 'high' : 'low';
    }

    return 'high';
  }

  generatePreviousTimes = (data) => {
    let prevTimes = '';

    for (let i = 0; i < data.start; i++) {
      prevTimes += `${ i } `;
    }

    if (data.start % 1 > 0) {
      // Find the closest quarter-second to the current time, for more dynamic results
      const dec = Math.floor((data.start % 1) * 4.0) / 4.0;
      prevTimes += ` ${ Math.floor(data.start) + dec }`;
    }

    return prevTimes;
  }

  render() {
    const data = this.props.entityKey
      ? this.props.contentState.getEntity(this.props.entityKey).getData()
      : {};

    return (
      <span
        data-start={ data.start }
        data-end={ data.end }
        data-confidence = { this.generateConfidence(data) }
        data-prev-times = { this.generatePreviousTimes(data) }
        data-entity-key={ data.key }
        className="Word">
        {this.props.children}
      </span>
    );
  }
}

Word.propTypes = {
  contentState: PropTypes.object,
  entityKey: PropTypes.string,
  children: PropTypes.array
};

export default Word;
