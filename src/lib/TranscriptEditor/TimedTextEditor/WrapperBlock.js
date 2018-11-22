import React from 'react';
import PropTypes from 'prop-types';
import { EditorBlock } from 'draft-js';

const speakerColours = [ '#e9d78e', '#e2975d', '#f19670', '#e16552', '#c94a53',
'#be5168', '#a34974', '#993767', '#65387d', '#4e2472' ];

class WrapperBlock extends React.Component {
  constructor(props) {
    super(props);
  }

  renderSpeaker = (speaker) => {
    const style = { color: speakerColours[0] };

    return (
      <span className="SpeakerBlock" style={ style }>{speaker}</span>
    );
  }

  renderTimecodes = (time) => {
    const style = { color: speakerColours[4] };

    return (
      <span className="TimecodeBlock" style={ style }>{time}</span>
    );
  }

  render() {
    console.log(this.props);
    const { block, contentState } = this.props;
    const { foo } = this.props.blockProps;

    const key = block.getKey();
    const speaker = block.getData().get('speaker');
    const words = block.getData().get('words');
    const start = block.getData().get('start');

    return (
      <div className="WrapperBlock">
        {this.renderSpeaker(speaker)}
        <br />
        {this.renderTimecodes(start)}
        <EditorBlock { ...this.props } />
      </div>
    );
  }
}

export default WrapperBlock;
