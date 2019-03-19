import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import MediaPlayer from "../src";

const fixtureProps = {
  title: "",
  mediaUrl: "",
  mediaDuration: "",
  hookSeek: action("hookSeek"),
  hookPlayMedia: action("hookPlayMedia"),
  hookIsPlaying: action("hookIsPlaying"),
  hookOnTimeUpdate: action("hookOnTimeUpdate"),
  rollBackValueInSeconds: 10,
  timecodeOffset: 10,
  handleAnalyticsEvents: action("handleAnalyticsEvents"),
  handleSaveTranscript: action("handleSaveTranscript")
};

storiesOf("MediaPlayer", module).add("default", () => {
  const videoRef = React.createRef();

  return (
    <React.Fragment>
      <MediaPlayer {...fixtureProps} videoRef={videoRef} />
      <video ref={videoRef}>
        <source
          type="video/mp4"
          src="https://download.ted.com/talks/KateDarling_2018S-950k.mp4"
        />
      </video>
    </React.Fragment>
  );
});
