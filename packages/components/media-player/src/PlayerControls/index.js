import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';

import {
  faSave,
  faTv,
  faPlay,
  faPause,
  faBackward,
  faForward,
  faUndo,
  faVolumeUp,
  faVolumeMute
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PlaybackRate from '../PlaybackRate';
import TimeBox from './TimeBox.js';

import style from './index.module.scss';

class PlayerControls extends React.Component {

  shouldComponentUpdate = (nextProps) => {
    return !isEqual(this.props, nextProps);
  }

  setIntervalHelperBackward = () => {
    // this.props.skipBackward();
    this.interval = setInterval(() => {
      this.props.skipBackward();
    }, 300);
  }

  setIntervalHelperForward = () => {
    // this.props.skipForward();
    this.interval = setInterval(() => {
      this.props.skipForward();
    }, 300);
  }

  clearIntervalHelper = () => {
    clearInterval(this.interval);
  }

  render() {

    let customBtnStyle; 
    let colorHover;
    if (this.props.customStyles) {
      const customBtn = this.props.customStyles.mediaPlayer.btn;
      colorHover = this.props.customStyles.mediaPlayer.btn.colorHover;
       customBtnStyle = { 
         color: customBtn.color, 
         background: customBtn.backgroundColor
      }
     
    }

    let pictureInPicture = ('pictureInPictureEnabled' in document) ? ( <button
      value="Picture-in-picture"
      title="Picture-in-picture"
      className={ `${ style.playerButton } ${ style.pip }` }
      style={customBtnStyle}
      onClick={ this.props.pictureInPicture }>
      <FontAwesomeIcon icon={ faTv } />
    </button> ) : null;

    if(this.props.mediaType === "audio"){
      pictureInPicture = null;
    }

    return (
      <>
       <style scoped>
          {`
          .${style.playerButton}:hover{
            background: ${colorHover}!important;
          }
          `}
        </style>
      <div className={ style.playerControls }>
       
        <TimeBox
          customStyles={this.props.customStyles ||  null}
          promptSetCurrentTime={ this.props.promptSetCurrentTime }
          currentTime={ this.props.currentTime }
          duration={ this.props.duration }
        />

        <div className={ style.btnsGroup }>
          <button
            value="seek backward by a set interval: alt r"
            title={`seek backward by a set interval: alt r | ${this.props.rollBackValueInSeconds} Sec`}
            className={ style.playerButton }
            style={customBtnStyle}
            onClick={ this.props.rollback }>{this.props.rollBackValueInSeconds} <FontAwesomeIcon icon={ faUndo } />
            {/* <FontAwesomeIcon icon={['faUndo', 'faUndo']} /> */}
          </button>

          <button
            value="seek backward: alt j"
            title="seek backward: alt j"
            className={ style.playerButton }
            style={customBtnStyle}
            onMouseDown={ this.setIntervalHelperBackward }
            onMouseUp={ this.clearIntervalHelper }
            onClick={ () => {this.props.skipBackward(); } }>
            <FontAwesomeIcon icon={ faBackward } />
          </button>

          <button
            value="Play/Pause: alt k"
            title="Play/Pause: alt k"
            className={ style.playerButton }
            style={customBtnStyle}
            onClick={ this.props.playMedia }>
            {this.props.isPlaying ? <FontAwesomeIcon icon={ faPause } /> : <FontAwesomeIcon icon={ faPlay } />}
          </button>

          <button
            value="seek forward: alt l"
            title="seek forward: alt l"
            className={ style.playerButton }
            style={customBtnStyle}
            onMouseDown={ this.setIntervalHelperForward }
            onMouseUp={ this.clearIntervalHelper }
            onClick={ () => {this.props.skipForward(); } }>
            <FontAwesomeIcon icon={ faForward } />
          </button>
        </div>

        <div className={ style.btnsGroup }>
          <PlaybackRate
            playbackRateOptions={ this.props.playbackRateOptions }
            playbackRate={ this.props.playbackRate }
            name={ 'playbackRate' }
            handlePlayBackRateChange={ this.props.setPlayBackRate }
            customStyles={customBtnStyle}
          />

          {pictureInPicture}

          <button
            value="Toggle Sound"
            title="Toggle Sound"
            className={ style.playerButton }
            style={customBtnStyle}
            onClick={ this.props.handleMuteVolume }>
            { this.props.isMute ? <FontAwesomeIcon icon={ faVolumeMute } /> : <FontAwesomeIcon icon={ faVolumeUp } /> }
          </button>
        </div>
      </div>
      </>
    );
  }
}

PlayerControls.propTypes = {
  playMedia: PropTypes.func,
  currentTime: PropTypes.string,
  timecodeOffset: PropTypes.string,
  promptSetCurrentTime: PropTypes.func,
  rollback: PropTypes.func,
  handleMuteVolume: PropTypes.func,
  duration: PropTypes.string,
  isPlaying: PropTypes.bool,
  isMute: PropTypes.bool,
  skipBackward: PropTypes.func,
  skipForward: PropTypes.func,
  playbackRate: PropTypes.number,
  playbackRateOptions: PropTypes.array,
  setPlayBackRate: PropTypes.func,
  pictureInPicture: PropTypes.func
};

export default PlayerControls;
