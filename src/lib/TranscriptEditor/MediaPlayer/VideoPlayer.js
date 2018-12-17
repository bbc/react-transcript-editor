import React from 'react';
import PropTypes from 'prop-types';

class VideoPlayer extends React.Component {
  render() {
    return (
      <video
        id="video"
        playsInline
        src={ this.props.mediaUrl }
        onTimeUpdate={ this.props.onTimeUpdate }
        type="video/mp4"
        data-testid="media-player-id"
        onClick={ this.props.onClick }
        ref={ this.props.videoRef }
      />
    );
  }
}

VideoPlayer.propTypes = {
  mediaUrl: PropTypes.string,
  onTimeUpdate: PropTypes.func,
  onClick: PropTypes.func
};

export default VideoPlayer;
