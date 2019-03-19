import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Settings from "../src";

const fixtureProps = {
  handleSettingsToggle: action("Toggle settings"),
  showTimecodes: true,
  showSpeakers: true,
  timecodeOffset: 10,
  defaultValueScrollSync: true,
  defaultValuePauseWhileTyping: true,
  defaultRollBackValueInSeconds: 10,
  previewIsDisplayed: true,
  handleShowTimecodes: action("handleShowTimecodes"),
  handleShowSpeakers: action("handleShowSpeakers"),
  handleSetTimecodeOffset: action("handleSetTimecodeOffset"),
  handleSettingsToggle: action("handleSettingsToggle"),
  handlePauseWhileTyping: action("handlePauseWhileTyping"),
  handleIsScrollIntoViewChange: action("handleIsScrollIntoViewChange"),
  handleRollBackValueInSeconds: action("handleRollBackValueInSeconds"),
  handlePreviewIsDisplayed: action("handlePreviewIsDisplayed"),
  handleChangePreviewViewWidth: action("handleChangePreviewViewWidth"),
  handleAnalyticsEvents: action("handleAnalyticsEvents")
};

storiesOf("Settings", module).add("default", () => (
  <Settings {...fixtureProps} />
));
