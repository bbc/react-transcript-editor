import React from 'react';
import PropTypes from 'prop-types';
import { EditorBlock } from 'draft-js';

import SpeakerLabel from './SpeakerLabel';

import style from './WrapperBlock.module.css';

class WrapperBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      speaker: '',
      start: ''
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
    const newSpeakerName = prompt('New Speaker Name?');

    if (newSpeakerName !== '') {
      this.setState({ speaker: newSpeakerName });
    }
  }

  render() {
    return (
      <div className={ style.WrapperBlock }>
        <span className={ style.SpeakerBlock }>
          <SpeakerLabel
            name={ this.state.speaker }
            handleOnClickEdit={ this.handleOnClickEdit }
          />
        </span>
        <span className={ style.TimeBlock }>{this.state.start}</span>
        <EditorBlock { ...this.props } />
      </div>
    );
  }
}

export default WrapperBlock;
