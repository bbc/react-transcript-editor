import React from 'react';

import MediaPreview from "./MediaPreview/MediaPreview";
import ProgressBar from "./ProgressBar/ProgressBar";
import PlayerControls from "./PlayerControls/PlayerControls";

class MediaController extends React.Component {
    render() {
      return (
          <div>
            <h2>MediaController</h2>
            <ProgressBar/>
            <MediaPreview/>
            <PlayerControls/>
        </div>
      );
    }
  }

export default MediaController;