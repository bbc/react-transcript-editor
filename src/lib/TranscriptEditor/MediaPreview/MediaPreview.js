import React from "react";
import styles from "./MediaPreview.module.css";

// inspired by https://github.com/bbc/nm2/blob/master/src/components/chapter/video/Video.jsx

class MediaPreview extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }
  render() {
    // conditional, if media player not defined then don't show
    let mediaPlayer;
    if (this.props.mediaUrl !== "") {
      mediaPlayer = (
        <video
          id="video"
          playsInline
          // autoPlay
          controls
          src={this.props.mediaUrl}
          type="video/mp4"
          data-testid="media-player-id"
          ref={this.videoRef}
        />
      );
    }

    return <section className={styles.videoSection}>{mediaPlayer}</section>;
  }
}

export default MediaPreview;
