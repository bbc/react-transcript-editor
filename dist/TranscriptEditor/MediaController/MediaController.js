import React from 'react';
import ProgressBar from "./ProgressBar/ProgressBar";
import PlayerControls from "./PlayerControls/PlayerControls";

class MediaController extends React.Component {
  render() {
    return React.createElement("div", null, React.createElement("h2", null, "MediaController"), React.createElement(ProgressBar, null), React.createElement(PlayerControls, null));
  }

}

export default MediaController;