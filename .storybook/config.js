import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

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

setOptions({
  name: 'react-transcript-editor',
  url: 'https://github.com/bbc/react-transcript-editor',
  addonPanelInRight: true
});

configure(loadStories, module);
