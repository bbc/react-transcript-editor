
# Storybook - npm setup - draft
_Based on PR [#135](https://github.com/bbc/react-transcript-editor/pull/135)_

## webpack 
Webpack is now used for bundling the component for npm distribution. 
Biggest change is that the build script now uses webpack instead of simply using babel

```diff
- "build:component": "rimraf dist && NODE_ENV=production babel  packages/ --out-dir dist --copy-files && rimraf dist/**/*.sample.json dist/**/*.sample.js dist/**/example-usage.js dist/**/*.test.js dist/**/*__tests__ dist/**/*__snapshots__ dist/**/*.spec.js",
+ "build:component": "webpack --config webpack.config.js",
+"pre:publish": "npm run build:component && rm ./dist/package.json || true && cp package.json ./dist/package.json && rm ./dist/README.md || true && cp README.md ./dist/README.md || true ",
+"publish:public": "npm run pre:publish && npm publish dist --access public",
 ```

see [`webpack.config.js`](./webpack.config.js) for more details, and these two blog posts for background.
- [How to package your React Component for distribution via NPM](https://itnext.io/how-to-package-your-react-component-for-distribution-via-npm-d32d4bf71b4f) - good for context but didn't follow this one
- [React + npm - How to Publish a React Component to npm](http://jasonwatmore.com/post/2018/04/14/react-npm-how-to-publish-a-react-component-to-npm) - followed this one + [webpack docs](https://webpack.js.org/concepts)

## import only certain components
Using [Webpack code splitting entry points](https://webpack.js.org/guides/code-splitting/#entry-points) as well as exporting from `packages/index.js` for max flexibility. 

As explained in the README you can now do both

```js
import TimedTextEditor from '@bbc/react-transcript-editor/TimedTextEditor';
```

```js
import { TimedTextEditor } from '@bbc/react-transcript-editor';
```

The difference is that 

> However if you are not using `TranscriptEditor` it is recommended to follow the second option and import individual components like: `@bbc/react-transcript-editor/TimedTextEditor` rather than the entire library. Doing so pulls in only the specific components that you use, which can significantly reduce the amount of code you end up sending to the client. (Similarly to how [`react-bootstrap`](https://react-bootstrap.github.io/getting-started/introduction) works)


At the moment webpack complains that some files are above the recommended size limit. It be interesting to see if there's a way to reduce this with some further  optimization eg lazyloading etc.. but I'd leave it for a subsequent PR for now

```
WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
This can impact web performance.
Assets: 
  TimedTextEditor.js (271 KiB)
  TranscriptEditor.js (455 KiB)
  index.js (455 KiB)
```


## Excluding tests and sample json
[webpack works out the dependency tree from the entry points](https://webpack.js.org/concepts/#entry) as it's making it's own [dependency graph](https://webpack.js.org/concepts/dependency-graph/), and because sample and tests files are not used or imported in production, then they are be automatically excluded in the bundle process.

<!-- ## unrelated question s
- [ ] npm script `fix-styles`? `prettier-stylelint` shall we add prettier for general code? -->

## Jest config
To run jest across the react components, we have to stub the css file dependencies using [`moduleNameMapper`](https://jestjs.io/docs/en/configuration#modulenamemapper-object-string-string) under the jest attribute in `package.json`


## Storybook css modules
- Storybook does not have support for css modules out of the box.
- If you remove CRA scripts then [you get this issue](https://github.com/storybooks/storybook/issues/2320) where css modules don't load in storybook.
- `storybook/webpack.config.js` augments the storybook one with support for css modules
- In previous setup, because CRA was present, with it's webpack config, storybook was showing css modules, as it was augmenting its webpack config with the CRA one.



## `webpack.config.js`  - example
```js
// based on https://itnext.io/how-to-package-your-react-component-for-distribution-via-npm-d32d4bf71b4f
// and http://jasonwatmore.com/post/2018/04/14/react-npm-how-to-publish-a-react-component-to-npm
const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    index: './packages/index.js',
    TranscriptEditor: './packages/components/transcript-editor/index.js',
    TimedTextEditor: './packages/components/timed-text-editor/index.js',
    MediaPlayer: './packages/components/media-player/index.js',
    ProgressBar: './packages/components/media-player/src/ProgressBar.js',
    PlaybackRate: './packages/components/media-player/src/PlaybackRate.js',
    PlayerControls: './packages/components/media-player/src/PlayerControls/index.js',
    RollBack: './packages/components/media-player/src/RollBack.js',
    Select: './packages/components/media-player/src/Select.js',
    VideoPlayer: './packages/components/video-player/index.js',
    Settings: './packages/components/settings/index.js',
    KeyboardShortcuts: './packages/components/keyboard-shortcuts/index.js',
    timecodeConverter: './packages/util/timecode-converter/index.js',
    exportAdapter: './packages/export-adapters/index.js',
    sttJsonAdapter: './packages/stt-adapters/index.js',
    groupWordsInParagraphsBySpeakersDPE: './packages/stt-adapters/digital-paper-edit/group-words-by-speakers.js'
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  optimization: {
    minimize: true
  },
  module: {
    rules: [
      {
        test: /\.module.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'packages'),
        // TODO: because it uses entry point to determine graph of dependencies, might not be needed to exclude test ans sample files?
        exclude: /(node_modules|bower_components|build|dist|demo|.storybook)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-env', '@babel/preset-react' ]
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom')
    }
  },
  externals: {
    // Don't bundle react or react-dom
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM'
    }
  }
};
```