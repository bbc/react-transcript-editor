# React Transcript Editor

<!-- _One liner_ -->

A React component to make transcribing audio and video easier and faster.

<p>
  <a href="https://unpkg.com/react-transcript-editor@1.3.1-alpha.4/TranscriptEditor.js">
    <img src="http://img.badgesize.io/https://unpkg.com/react-transcript-editor@1.3.1-alpha.4/index.js?compression=gzip&amp;label=size">
  </a>
  <a href="https://packagephobia.now.sh/result?p=@bbc/react-transcript-editor">
    <img src="https://badgen.net/packagephobia/install/@bbc/react-transcript-editor">
  </a>
  <a href="./package.json">
    <img src="https://img.shields.io/npm/v/@bbc/react-transcript-editor.svg?maxAge=3600&label=version&colorB=007ec6">
  </a>
</p>
<br/>

The project uses [this github project boards to organise and the co-ordinate development](https://github.com/bbc/react-transcript-editor/projects).

_--> Work in progress <--_

<!-- _Screenshot of UI - optional_ -->

- [You can see a demo by clicking here](https://bbc.github.io/react-transcript-editor/iframe.html?id=demo--default) (and then click the `load demo` button)
- [And you can see a list of features here](./docs/features-list.md).

## Development env

 <!-- _How to run the development environment_ -->

- npm > `6.1.0`
- [Node 10 - dubnium](https://scotch.io/tutorials/whats-new-in-node-10-dubnium)

Node version is set in node version manager [`.nvmrc`](https://github.com/creationix/nvm#nvmrc)

<!-- _Coding style convention ref optional, eg which linter to use_ -->

<!-- _Linting, github pre-push hook - optional_ -->

## Setup

<!-- _stack - optional_ -->
<!-- _How to build and run the code/app_ -->

Fork this repository + git clone + cd into folder

## Usage - development

Git clone this repository and cd into the folder.

To start the storybook run

```
npm start
```

Visit [http://localhost:6006](http://localhost:6006)

## Usage - production

Available on [npm - `@bbc/react-transcript-editor`](https://www.npmjs.com/package/@bbc/react-transcript-editor)

```
npm install @bbc/react-transcript-editor
```

```js
import TranscriptEditor from "@bbc/react-transcript-editor";
```

Minimal data needed for initialization 

```js
<TranscriptEditor
  transcriptData={someJsonFile}
  mediaUrl={"https://download.ted.com/talks/KateDarling_2018S-950k.mp4"}
/>
```

With more attributes 
```js
<TranscriptEditor
  transcriptData={someJsonFile}
  mediaUrl={"https://download.ted.com/talks/KateDarling_2018S-950k.mp4"}
  handleAutoSaveChanges={this.handleAutoSaveChanges}
  autoSaveContentType={'digitalpaperedit'}
  isEditable={true}
  spellCheck={false}
  sttJsonType={"bbckaldi"}
  handleAnalyticsEvents={this.handleAnalyticsEvents}
  fileName={"ted-talk.mp4"}
  title={"Ted Talk"}
  ref={this.transcriptEditorRef}
  mediaType={'video'}
/>
```

| Attributes            | Description                                                                                                             | required |   type    |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------------- | :------: | :-------: |
| transcriptData        | Transcript json                                                                                                         |   yes    |   Json    |
| mediaUrl              | string url to media file - audio or video                                                                               |   yes    |  String   |
|`handleAutoSaveChanges`| returns content of transcription after a change                                                                         |    no    |  Function |
| autoSaveContentType        | specify the file format for data returned by `handleAutoSaveChanges`,falls back on `sttJsonType`. or `draftjs`          |    no    |  string   |
| isEditable            | set to true if you want to be able to edit the text                                                                     |    no    |  Boolean  |
| spellCheck            | set to true if you want the browser to spell check this transcript                                                      |    no    |  Boolean  |
|`handleAnalyticsEvents`| if you want to collect analytics events.                                                                                |    no    | Function  |
| fileName              | used for saving and retrieving local storage blob files                                                                 |    no    |  String   |
| title                 | defaults to empty string                                                                                                |    no    |  String   |
| ref                   | if you want to have access to internal functions such as retrieving content from the editor. eg to save to a server/db. |    no    | React ref |
| mediaType             | can be `audio` or `video`, if not provided the component uses the url file type to determine and adjust use of the page layout |    no    | String |

See [`./demo/app.js` demo](./demo/app.js) as a more detailed example usage of the component.

_Note: `fileName` it is optional but it's needed if working with user uploaded local media in the browser, to be able to save and retrieve from local storage. For instance if you are passing a blob url to `mediaUrl` using `createObjectURL` this url is randomly re-generated on every page refresh so you wouldn't be able to restore a session, as `mediaUrl` is used as the local storage key. See demo app for more detail example of this[`./src/index.js`](./src/index.js)_

_Note: `mediaType` if not defined, the component uses the url to determine the type and adjust the layout accordingly, however this could result in a slight delay when loading the component as it needs to fetch the media to determine it's file type_

### Typescript projects

If using in a parent project where [typescript](https://www.typescriptlang.org/) is being used you might need to add `//@ts-ignore` before the import statment like this

```js
//@ts-ignore
import { TranscriptEditor } from "@bbc/react-transcript-editor";
```

#### Internal components

You can also import some of the underlying React components directly.

- `TranscriptEditor`
- `TimedTextEditor`
- `MediaPlayer`
- `VideoPlayer`
- `Settings`
- `KeyboardShortcuts`

- `ProgressBar`
- `PlaybackRate`
- `PlayerControls`
- `RollBack`
- `Select`

To import the components you can do as follows

```js
import TimedTextEditor from "@bbc/react-transcript-editor/TimedTextEditor";
```

```js
import { TimedTextEditor } from "@bbc/react-transcript-editor";
```

However if you are not using `TranscriptEditor` it is recommended to follow the second option and import individual components like: `@bbc/react-transcript-editor/TimedTextEditor` rather than the entire library. Doing so pulls in only the specific components that you use, which can significantly reduce the amount of code you end up sending to the client. (Similarly to how [`react-bootstrap`](https://react-bootstrap.github.io/getting-started/introduction) works)

See [the storybook](https://bbc.github.io/react-transcript-editor) for each component details on optional and required attributes.

You can also use this node modules as standalone

```js
import exportAdapter from "@bbc/react-transcript-editor/exportAdapter";
```

Converts from draftJs json format to other formats

```js
import sttJsonAdapter from "@bbc/react-transcript-editor/sttJsonAdapter";
```

Converts various stt json formats to draftJs

```js
import {
  secondsToTimecode,
  timecodeToSeconds,
  shortTimecode
} from "@bbc/react-transcript-editor/timecodeConverter";
```

some modules to convert to and from timecodes

## System Architecture

<!-- _High level overview of system architecture_ -->

- uses [`storybook`](https://storybook.js.org) with the setup as [explained in their docs](https://storybook.js.org/docs/guides/guide-react/) to develop this React.
- This uses [CSS Modules](https://github.com/css-modules/css-modules) to contain the scope of the css for this component.
- [`.storybook/webpack.config.js](./.storybook/webpack.config.js) enanches the storybook webpack config to add support for css modules.
- The parts of the component are inside [`./packages`](./packages)
- [babel.config.js](./babel.config.js) provides root level system config for [babel 7](https://babeljs.io/docs/en/next/config-files#project-wide-configuration).

<!-- - for build, packaging, and deployment of the npm module, we use webpack with babel 7 -->

## Documentation

There's a [docs](./docs) folder in this repository.

[docs/notes](./docs/notes) contains dev notes on various aspects of the project.

[docs/adr](./docs/adr) contains [Architecture Decision Record](https://github.com/joelparkerhenderson/architecture_decision_record).

> An architectural decision record (ADR) is a document that captures an important architectural decision made along with its context and consequences.

We are using [this template for ADR](https://gist.github.com/iaincollins/92923cc2c309c2751aea6f1b34b31d95)

[There also QA testing docs](./docs/qa/README.md) to manual test the component before a major release, (QA testing does not require any technical knowledge).

## Build

<!-- _How to run build_ -->

> To transpile `./packages` and create a build in the `./dist` folder, run:

```
npm run build:component
```

## Demo & storybook

- **Storybook** can bew viewed at [https://bbc.github.io/react-transcript-editor/](https://bbc.github.io/react-transcript-editor/)

- **Demo** can be viewed at [https://bbc.github.io/react-transcript-editor/iframe.html?id=demo--default](https://bbc.github.io/react-transcript-editor/iframe.html?id=demo--default)

http://localhost:6006

<!-- https://github.com/gitname/react-gh-pages
-->

## Build - storybook

To build the storybook as a static site

```
npm run build:storybook
```

## Publish storybook & demo to github pages

This github repository uses [github pages](https://pages.github.com/) to host the storybook and the demo of the component

```
npm run deploy:ghpages
```

add to git, and push to origin master to update

<!-- https://help.github.com/articles/user-organization-and-project-pages/#project-pages-sites -->

Alternatively If you simply want to build the demo locally in the `build` folder then just

```
npm run build:storybook
```

you can then run this command to serve the static site locally

```
npm run build:storybook:serve
```

## Tests

<!-- _How to carry out tests_ -->

Test coverage using [`jest`](https://jestjs.io/), to run tests

```sh
npm run test
```

During development you can use

```sh
npm run test:watch
```

## Travis CI

On commit this repo uses the [.travis.yml](./.travis.yml) config tu run the automated test on [travis CI](https://travis-ci.org/bbc/react-transcript-editor).

## Deployment

<!-- _How to deploy the code/app into test/staging/production_ -->

To push to [npm - `@bbc/react-transcript-editor`](https://www.npmjs.com/package/@bbc/react-transcript-editor)

```
npm publish:public
```

This runs `npm run build:component` and `npm publish --access public` under the hood

> Note that only `README.md` and the `dist` folders are published to npm.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) guidelines.

## Licence

<!-- mention MIT Licence -->

See [LICENCE](./LICENCE.md)

## Legal Disclaimer

_Despite using React and DraftJs, the BBC is not promoting any Facebook products or other commercial interest._
