import React from 'react';

import styles from './MediaPreview.module.css';

class MediaPreview extends React.Component {
    render() {
      return (
        <section className={styles.videoSection}>
         <h3>MediaPreview </h3>
         <video
            id="video"
            playsInline
            // autoPlay
            controls
            src={this.props.mediaUrl}
            type="video/mp4"
            data-testid="video-player"
            ref={this.videoRef}
          />
        </section>
      );
    }
  }

export default MediaPreview;