import { configure } from "@storybook/react";

// automatically import all files ending in *.stories.js
const packages = require.context("../packages/", true, /.stories.js$/);
const demo = require.context("../demo/", true, /.stories.js$/);

configure(() => {
  packages.keys().forEach(filename => packages(filename));
  demo.keys().forEach(filename => demo(filename));
}, module);
