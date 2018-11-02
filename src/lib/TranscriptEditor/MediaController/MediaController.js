import React from 'react';


import ProgressBar from "./ProgressBar/ProgressBar";
import PlayerControls from "./PlayerControls/PlayerControls";

class MediaController extends React.Component {
    render() {
      return (
          <div>
            <h2>MediaController</h2>
            <ProgressBar/>
           
            <PlayerControls/>
        </div>
      );
    }
  }

export default MediaController;