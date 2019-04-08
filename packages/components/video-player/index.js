import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.css';

class VideoPlayer extends React.Component {
  handlePlayMedia = () => {
    if (this.props.videoRef.current !== null) {
      return this.props.videoRef.current.paused
        ? this.props.videoRef.current.play()
        : this.props.videoRef.current.pause();
    }
  };
  render() {
    const isDisplayed = this.props.previewIsDisplayed ? 'inline' : 'none';

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
        className={ styles.videoEl }
        style={ {
          display: isDisplayed
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
  previewIsDisplayed: PropTypes.bool,
  previewViewWidth: PropTypes.string
};

export default VideoPlayer;
