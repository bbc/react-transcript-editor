import React from 'react';
import styles from './index.module.css';
// import timecodes from 'node-timecodes';
import { timecodeToSeconds, secondsToTimecode  } from '../../Util/timecode-converter/index.js';

// inspired by https://github.com/bbc/nm2/blob/master/src/components/chapter/video/Video.jsx

class MediaPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();

    this.state = {
      playBackRate:1,
      rollBackValueInSeconds: 15,
      timecodeOffset: 0
    }
  }

  componentDidMount(){
    this.props.hookSeek(this.setCurrentTime)
  }

  setCurrentTime = (newCurrentTime) => {
    if(newCurrentTime!=='' && newCurrentTime!==null){
    // hh:mm:ss:ms - mm:ss - m:ss - ss - seconds number or string and hh:mm:ss
      const newCurrentTimeInSeconds = timecodeToSeconds(newCurrentTime); 

      if (this.videoRef.current  !== null) {
        const videoRef = this.videoRef.current;
        // videoRef.load();
        if ( videoRef.readyState === 4 ) {
          // it's loaded
          videoRef.currentTime = newCurrentTimeInSeconds;
          videoRef.play();
        }
      }
    }
  }

  setTimeCodeOffset = (newTimeCodeOffSet)=>{
    if(newTimeCodeOffSet!=='' && newTimeCodeOffSet!==null){
      // use similar helper function from above to convert 
      let newCurrentTimeInSeconds = newTimeCodeOffSet;
      if(newTimeCodeOffSet.includes(':')){
        newCurrentTimeInSeconds = timecodeToSeconds(newTimeCodeOffSet);
        this.setState({ timecodeOffset: newCurrentTimeInSeconds })
      }
    }
  }

  rollBack = () =>{
    if (this.videoRef.current  !== null) {
      // get video duration 
      const videoElem = this.videoRef.current;
      const tmpDesiredCurrentTime = videoElem.currentTime - this.state.rollBackValueInSeconds;
      // > 0 < duration of video  
      this.setCurrentTime(tmpDesiredCurrentTime);
    }
  }

  handleTimeUpdate = (e)=>{
    // eslint-disable-next-line react/prop-types
    this.props.hookOnTimeUpdate(e.target.currentTime)
  }

  handlePlayBackRateChange = (e)=>{
    this.setPlayBackRate(e.target.value)
  }

  setPlayBackRate = (speedValue) =>{
    // value between 0.2 and 3.5
    if(this.videoRef.current!== null){
      if(speedValue>=0.2 && speedValue<=3.5){
        this.setState({
            playBackRate: speedValue
          },()=>{
              this.videoRef.current.playbackRate = speedValue;
            
          })
      }
    }
  }

  handleChangeReplayRollbackValue = (e)=>{
    if(this.videoRef.current!== null){
        this.setState({
          rollBackValueInSeconds: e.target.value 
        })
    }
  }

  handleMuteVolume = (e) => {
    // https://www.w3schools.com/tags/av_prop_volume.asp
    if(this.videoRef.current!== null){
      if(this.videoRef.current.volume > 0){
        this.videoRef.current.volume  = 0;
      }
      else{
        this.videoRef.current.volume =1;
      }
    }
  }

  isPlaying=(e)=>{
    if(this.videoRef.current!== null){
      if(this.videoRef.current.paused){
        return false;
      }else{
       return true;
      }
    }
  }
  
  playMedia =(e)=>{
    if(this.videoRef.current!== null){
      if(this.videoRef.current.paused){
        this.videoRef.current.play();
      }else{
        this.videoRef.current.pause();
      }
    }
  }

  handleProgressBarClick = (e) =>{
    if(this.videoRef.current!== null){
      // length of the bar
      const lengthOfBar =  e.target.offsetWidth; 
      // distance of the position of the lick from the start of the progress bar element
      // location of click - start point of the bar 
      const clickLength = e.screenX - e.target.offsetLeft;
      const positionPercentage = clickLength / lengthOfBar;
      // total time
      const totalTime = e.target.max;
      const resultInSeconds = totalTime * positionPercentage;  
      // rounding up 
      const roundNewCurrentTime = parseFloat((resultInSeconds).toFixed(2));
      this.setCurrentTime(roundNewCurrentTime);
    }
  }

  render() {
    // conditional, if media player not defined then don't show
    let mediaPlayerEl;
    if (this.props.mediaUrl !== null) {
      mediaPlayerEl = (
          <video
          id="video"
          playsInline
          // autoPlay
          // controls
          src={ this.props.mediaUrl }
          onTimeUpdate={ this.handleTimeUpdate }
          // TODO: video type
          type="video/mp4"
          data-testid="media-player-id"
          onClick={ this.playMedia }
          ref={ this.videoRef }
        />
      );
    }

    let dataListOptionValuesForPlaybackRate = '';
    for(let i = 0.2; i<=3.6;i+=0.1){
      dataListOptionValuesForPlaybackRate += `<option value="${ parseFloat(i).toFixed(2) }" />\n`
    }

    const playerControlsSection = <section>
        {/* Progress bar  */}
        <progress 
            className={ styles.progressBar } 
            max={ this.videoRef.current!== null? parseInt(this.videoRef.current.duration) : '100' }
            value= { this.videoRef.current!== null? parseInt(this.videoRef.current.currentTime) : '0' }
            onClick={ (e)=>{ this.handleProgressBarClick(e) } }
            />

        <br/>
        {/* Play / Pause Btn  */}
        {this.videoRef.current!== null? <button onClick={ ()=>{ this.playMedia()} }> {this.isPlaying()? '❚❚' : '▶'} </button>:''}
        ️
        {/* Display timecodes */}
        <code>{this.videoRef.current!== null ? secondsToTimecode(this.videoRef.current.currentTime + this.state.timecodeOffset): '00:00:00:00'}</code>
            /
        <code>{this.videoRef.current!== null ?  secondsToTimecode(this.videoRef.current.duration + this.state.timecodeOffset): '00:00:00:00'}</code>

        <button type="button" onClick={ ()=>{ this.setCurrentTime( prompt('Timecode - hh:mm:ss:ms - mm:ss - m:ss - Seconds '))} }>Jump To Timecode ⏱</button>
        <button type="button" onClick={ ()=>{ this.setTimeCodeOffset( prompt('Timecode offset as - hh:mm:ss:ms'))} }>Set Timecode Offset ⏱</button>

        <output><code>{secondsToTimecode(this.state.timecodeOffset)}</code></output>
            
        {/* Volume Toggle */}
        <p>Volume</p>
        <label className={ styles.switch }>
            <input type="checkbox" 
                defaultChecked="true" 
                onChange={ this.handleMuteVolume }
                />
            <span className={ styles.slider }></span>
        </label>

        {/* Playback Rate  */}
        <p>Playback Rate 
            <b> <output >{  `x${ this.state.playBackRate }` }</output> </b>
        </p>
  
        <input 
              type="range"  
              min="0.2"
              value={ this.state.playBackRate } 
              max="3.5"  
              step="0.1"  
              list="tickmarks"
              onChange={ this.handlePlayBackRateChange }
              />

        <datalist id="tickmarks">
            {dataListOptionValuesForPlaybackRate}
                
        </datalist>
        <br/>
        <button type="button" onClick={ ()=> { this.setPlayBackRate(1)} }>Reset</button>
            
        {/* Rollback ⟲ ↺  */}
        <p>Rollback  
            <b> <output >{  `x${ this.state.rollBackValueInSeconds }` }</output></b> Seconds
        </p>
      
        <input 
              type="range"  
              min="1"
              max="60"  
              value={ this.state.rollBackValueInSeconds  } 
              onChange={ this.handleChangeReplayRollbackValue }
              /> 
        <br/>
        <button type="button" onClick={ ()=> { this.rollBack()} }>↺</button>

    </section>;

    return (
        <section className={ styles.videoSection }>
            {mediaPlayerEl}
            {this.props.mediaUrl !== null?  playerControlsSection:''}
        </section>
        );
  }
}

export default MediaPlayer;
