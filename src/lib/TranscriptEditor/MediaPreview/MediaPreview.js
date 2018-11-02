import React from 'react';
import styles from './MediaPreview.module.css';

// inspired by https://github.com/bbc/nm2/blob/master/src/components/chapter/video/Video.jsx

class MediaPreview extends React.Component {

  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }
    render() {
      return (
        <section className={styles.videoSection}>
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
        </section>
      );
    }
  }

export default MediaPreview;