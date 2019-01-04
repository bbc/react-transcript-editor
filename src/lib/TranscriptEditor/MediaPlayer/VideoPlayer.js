import React from 'react';
import PropTypes from 'prop-types';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
  }

  handlePlayMedia = () => {
    console.log('handle media', this.props.videoRef.current, this.props.videoRef);
    if (this.props.videoRef.current !== null) {
      this.props.videoRef.current.paused?  this.props.videoRef.current.play():  this.props.videoRef.current.pause();
    }
  };
  render() {
    const isDisplayed = this.props.previewIsDisplayed? 'inline' : 'none';

    let viewWith = this.props.viewWith? this.props.viewWith+'vw' : '15vw';
    // making responsive for mobile screen size
    viewWith = window.innerWidth >'768'?   viewWith  : 'auto';

    return (
      <video
        id="video"
        playsInline
        src={ this.props.mediaUrl }
        onTimeUpdate={ this.props.onTimeUpdate }
        type="video/mp4"
        data-testid="media-player-id"
        onClick={ this.handlePlayMedia }
        onLoadedData={ this.props.onLoadedDataGetDuration }
        ref={ this.props.videoRef }
        style={ {
          display: isDisplayed,
          'max-width':  viewWith,
          cursor: 'pointer'
        } }
      />
    );
  }
}

VideoPlayer.propTypes = {
  mediaUrl: PropTypes.string,
  onTimeUpdate: PropTypes.func,
  onClick: PropTypes.func,
  videoRef: PropTypes.object,
  onLoadedDataGetDuration: PropTypes.func,
  previewIsDisplayed: PropTypes.bool
};

export default VideoPlayer;
