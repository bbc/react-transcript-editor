# Bundling with Webpack for NPM and Storybook

_Based on PR [#135](https://github.com/bbc/react-transcript-editor/pull/135)_

> [Storybook](https://storybook.js.org/) is an open source tool for developing UI components in isolation for React, Vue, and Angular. It makes building stunning UIs organized and efficient.

## Getting from Code change to Storybook

1. Commit changes to master
2. Publish component to NPM
   1. `npm run publish:public`
3. Publish to Github Pages - `npm run deploy:ghpages`

## Webpack

Webpack is used for bundling the component for NPM distribution. We followed [this guide](http://jasonwatmore.com/post/2018/04/14/react-npm-how-to-publish-a-react-component-to-npm) and [webpack docs](https://webpack.js.org/concepts) in order to publish React Component to NPM.

When we run `npm run publish:public` to publish components to NPM, it also runs `pre:publish`, which also runs `build:component`, which generates a `webpack.config.js`.

```js
const path = require("path");

module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: {
    index: "./packages/index.js",
    TranscriptEditor: "./packages/components/transcript-editor/index.js",
    TimedTextEditor: "./packages/components/timed-text-editor/index.js",
    MediaPlayer: "./packages/components/media-player/index.js",
    ProgressBar: "./packages/components/media-player/src/ProgressBar.js",
    PlaybackRate: "./packages/components/media-player/src/PlaybackRate.js",
    PlayerControls:
      "./packages/components/media-player/src/PlayerControls/index.js",
    RollBack: "./packages/components/media-player/src/RollBack.js",
    Select: "./packages/components/media-player/src/Select.js",
    VideoPlayer: "./packages/components/video-player/index.js",
    Settings: "./packages/components/settings/index.js",
    KeyboardShortcuts: "./packages/components/keyboard-shortcuts/index.js",
    timecodeConverter: "./packages/util/timecode-converter/index.js",
    exportAdapter: "./packages/export-adapters/index.js",
    sttJsonAdapter: "./packages/stt-adapters/index.js",
    groupWordsInParagraphsBySpeakersDPE:
      "./packages/stt-adapters/digital-paper-edit/group-words-by-speakers.js",
  },
  output: {
    path: path.resolve("dist"),
    filename: "[name].js",
    libraryTarget: "commonjs2",
  },
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.module.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, "packages"),
        // TODO: because it uses entry point to determine graph of dependencies, might not be needed to exclude test ans sample files?
        exclude: /(node_modules|bower_components|build|dist|demo|.storybook)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      react: path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
  },
  externals: {
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React",
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "ReactDOM",
      root: "ReactDOM",
    },
  },
};
```

[Webpack also works out the dependency tree from the entry points](https://webpack.js.org/concepts/#entry) as it's making it's own [dependency graph](https://webpack.js.org/concepts/dependency-graph/). Since it's using production, the bundling process will automatically exclude test and sample files.

### Importing Components

Using [Webpack code splitting entry points](https://webpack.js.org/guides/code-splitting/#entry-points) as well as exporting from `packages/index.js`, you can now do both styles of importing:

```js
import TimedTextEditor from "@bbc/react-transcript-editor/TimedTextEditor";
```

and

```js
import { TimedTextEditor } from "@bbc/react-transcript-editor";
```

However, as mentioned in the README - **it is preferred to import individual components like using the first option:
`@bbc/react-transcript-editor/TimedTextEditor`** as the other importing method imports the entire library.

### Caveats

#### Size limit

At the moment webpack complains that some files are above the recommended size limit. It would be interesting to see if there's a way to reduce this with some further optimization with lazy-loading or other ways. But this is for a subsequent PR for now.

```t
WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
This can impact web performance.
Assets:
  TimedTextEditor.js (271 KiB)
  TranscriptEditor.js (455 KiB)
  index.js (455 KiB)
```

#### CSS module support for Storybook

Storybooks **DO NOT support CSS modules out of the box**, so if you remove CRA (`create-react-app`) scripts [the css modules will not load in the Storybook](https://github.com/storybooks/storybook/issues/2320).
`storybook/webpack.config.js` augments the storybook with support for CSS modules.

## Testing

To run `Jest` across the react components, we have to stub the css file dependencies using [`moduleNameMapper`](https://jestjs.io/docs/en/configuration#modulenamemapper-object-string-string) under the jest attribute in `package.json`

### Further reading

#### References

- [How to package your React Component for distribution via NPM](https://itnext.io/how-to-package-your-react-component-for-distribution-via-npm-d32d4bf71b4f)

#### Previous setups

- [Component Development Set up (old)](https://github.com/bbc/react-transcript-editor/blob/master/docs/adr/2018-10-05-component-development-setup.md)
- [Babel Setup](https://github.com/bbc/react-transcript-editor/blob/master/docs/adr/2018-10-05-component-development-setup.md) to do the build.

```diff
- "build:component": "rimraf dist && NODE_ENV=production babel  packages/ --out-dir dist --copy-files && rimraf dist/**/*.sample.json dist/**/*.sample.js dist/**/example-usage.js dist/**/*.test.js dist/**/*__tests__ dist/**/*__snapshots__ dist/**/*.spec.js",
+ "build:component": "webpack --config webpack.config.js",
+"pre:publish": "npm run build:component && rm ./dist/package.json || true && cp package.json ./dist/package.json && rm ./dist/README.md || true && cp README.md ./dist/README.md || true ",
+"publish:public": "npm run pre:publish && npm publish dist --access public",
```
