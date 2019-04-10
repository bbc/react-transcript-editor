import { addParameters, configure } from '@storybook/react';

// automatically import all files ending in *.stories.js
// https://webpack.js.org/guides/dependency-management/
const components = require.context('../packages/components/', true, /.stories.js$/);
const demo = require.context('../demo/', true, /.stories.js$/);
const styles = require.context('./styles', true, /\.scss$/);

function loadStories() {
  demo.keys().forEach((filename) => demo(filename));
  components.keys().forEach((filename) => components(filename));
  styles.keys().forEach((filename) => styles(filename));
}

addParameters({
  options: {
    panelPosition: 'right',
    sidebarAnimations: true
  },
});

configure(loadStories, module);
