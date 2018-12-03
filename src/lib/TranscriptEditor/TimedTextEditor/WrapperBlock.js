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
        <div className={ style.markers }>
          <SpeakerLabel
            name={ this.state.speaker }
            handleOnClickEdit={ this.handleOnClickEdit }
            />
          <span className={ style.time }>{this.state.start}</span>
        </div>
        <div className={ style.text }>
          <EditorBlock { ...this.props } />
        </div>
      </div>
    );
  }
}

export default WrapperBlock;
