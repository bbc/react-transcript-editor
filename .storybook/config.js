import { configure } from "@storybook/react";

// automatically import all files ending in *.stories.js
// https://webpack.js.org/guides/dependency-management/
const components = require.context('../packages/components/', true, /.stories.js$/);
const demo = require.context('../demo/', true, /.stories.js$/);

configure(() => {
  components.keys().forEach(filename => components(filename));
  demo.keys().forEach(filename => demo(filename));
}, module);
