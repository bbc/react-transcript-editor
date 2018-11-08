import React from 'react';
import styles from './index.module.css';

// inspired by https://github.com/bbc/nm2/blob/master/src/components/chapter/video/Video.jsx

class MediaPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentDidMount(){
    this.props.hookSeek(this.setCurrentTime)
  }

  componentWillReceiveProps(nextProps){
    console.log('3.MediaPreview -  componentWillReceiveProps ',nextProps.seekToCurrentTime)
    if(nextProps.seekToCurrentTime !== undefined){
      this.setCurrentTime(nextProps.seekToCurrentTime)
    }
  }

  setCurrentTime = (newCurrentTime) => {
    if (this.videoRef.current  !== null) {
      const videoRef = this.videoRef.current;
      // videoRef.load();
      if ( videoRef.readyState === 4 ) {
        // it's loaded
        videoRef.currentTime = newCurrentTime;
        console.log('videoRef.currentTime',videoRef.currentTime,newCurrentTime);
        videoRef.play();
      }
      
    }
  }

  handleTimeUpdate = (e)=>{
    // eslint-disable-next-line react/prop-types
    // this.props.onTimeUpdate(e.target.currentTime)
  }

  render() {
    // conditional, if media player not defined then don't show
    let mediaPlayer;
    if (this.props.mediaUrl !== null) {
      mediaPlayer = (
          <video
          id="video"
          playsInline
          // autoPlay
          controls
          src={ this.props.mediaUrl }
          onTimeUpdate={ this.handleTimeUpdate }
          // TODO: video type
          type="video/mp4"
          data-testid="media-player-id"
          ref={ this.videoRef }
        />
      );
    }

    return <section className={ styles.videoSection }>{mediaPlayer}</section>;
  }
}

export default MediaPlayer;
