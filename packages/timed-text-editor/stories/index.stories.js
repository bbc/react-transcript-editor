import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import bbcKaldiTranscript from "./fixtures/bbc-kaldi.json";

import TimedTextEditor from "../src";

const fixtureProps = {
  transcriptData: bbcKaldiTranscript,
  mediaUrl: "https://download.ted.com/talks/KateDarling_2018S-950k.mp4",
  isEditable: true,
  onWordClick: action("onWordClick"),
  sttJsonType: "bbckaldi",
  isPlaying: action("isPlaying"),
  playMedia: action("playMedia"),
  currentTime: 0,
  isScrollIntoViewOn: true,
  isPauseWhileTypingOn: true,
  timecodeOffset: 0,
  handleAnalyticsEvents: action("handleAnalyticsEvents"),
  showSpeakers: true,
  showTimecodes: true,
  fileName: "KateDarling_2018S-950k.mp4"
};

storiesOf("TimedTextEditor", module).add("default", () => (
  <TimedTextEditor {...fixtureProps} />
));
