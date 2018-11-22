import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Word extends PureComponent {
  render() {
    const data = this.props.entityKey
      ? this.props.contentState.getEntity(this.props.entityKey).getData()
      : {};

    return (
      <span data-start={ data.start } data-entity-key={ data.key } className="Word">
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
