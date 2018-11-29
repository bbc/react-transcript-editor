import React from 'react';
import PropTypes from 'prop-types';
import { EditorBlock } from 'draft-js';

import SpeakerLabel from './SpeakerLabel';

class WrapperBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      speaker: 'null',
      start: '00:00:00'
    };
  }

  componentDidMount() {
    const { block } = this.props;
    const speaker = block.getData().get('speaker');
    const start = block.getData().get('start');

    this.setState({
      speaker: speaker,
      start: start
    })
  }

  handleOnClickEdit = (e) => {
    const newSpeakerName = prompt('New Speaker Name?')

    this.setState({ speaker: newSpeakerName });
  }

  render() {
    return (
      <div className="WrapperBlock">
        <span className="SpeakerBlock">
          <SpeakerLabel
          name={ this.state.speaker }
          handleOnClickEdit={ this.handleOnClickEdit }
          />
        </span>

        <br />
        <span className="TimeBlock"> {this.state.start} </span>
        <br />
        <EditorBlock { ...this.props } />
      </div>
    );
  }
}

export default WrapperBlock;
