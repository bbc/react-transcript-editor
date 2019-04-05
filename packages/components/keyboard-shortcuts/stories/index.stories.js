import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import KeyboardShortcuts from "../src";

const fixtureProps = {
  handleShortcutsToggle: action("Shortcuts toggle")
};

storiesOf("KeyboardShortcuts", module).add("default", () => (
  <KeyboardShortcuts {...fixtureProps} />
));
