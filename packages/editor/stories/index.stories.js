import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import bbcKaldiTranscript from "./fixtures/bbc-kaldi.json";

import Editor from "../src";

const fixtureProps = {
  title: "Ted Talk Kate Darling",
  mediaUrl: "https://download.ted.com/talks/KateDarling_2018S-950k.mp4",
  sttJsonType: "bbckaldi",
  isEditable: true,
  fileName: "KateDarling_2018S-950k.mp4",
  transcriptData: bbcKaldiTranscript,
  handleAnalyticsEvents: action("Analytics event")
};

storiesOf("Editor", module).add("default", () => <Editor {...fixtureProps} />);
