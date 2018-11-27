import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Word extends PureComponent {
  render() {
    const data = this.props.entityKey
      ? this.props.contentState.getEntity(this.props.entityKey).getData()
      : {};

      // see https://www.bram.us/2016/10/13/css-attribute-value-less-than-greater-than-equals-selectors/
      // to make previous words to currentTime hilightable 
      // adding all numbers from zero to start time of that word rounded up
      // to seconds to make it hilightable
      let previousTimesUpToStartTime = '';
      for(let i =0; i< parseInt(data.start); i++){
        previousTimesUpToStartTime += ` ${ i }`; 
      }

    return (
      <span data-start={ data.start } data-prev-times={ previousTimesUpToStartTime } data-entity-key={ data.key } className="Word">
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
