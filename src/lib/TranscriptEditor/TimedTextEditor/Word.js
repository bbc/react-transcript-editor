import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Word extends PureComponent {
  render() {
    const data = this.props.entityKey
      ? this.props.contentState.getEntity(this.props.entityKey).getData()
      : {};

    const confidence = data.confidence > 0.6 ? 'high' : 'low';

    let prevTimes = '';
    for (let i = 0; i < data.start; i++) {
      prevTimes += `${ i } `;
    }

    if (data.start % 1 > 0.5) prevTimes += ` ${ Math.floor(data.start) }.5`;

    return (
      <span
        data-start={ data.start }
        data-end={ data.end }
        data-confidence = { confidence }
        data-prev-times = { prevTimes }
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
