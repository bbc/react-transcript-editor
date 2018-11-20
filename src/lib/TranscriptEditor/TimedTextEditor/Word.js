import React, { PureComponent } from 'react';

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

export default Word;
