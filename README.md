# React Transcript Editor

<!-- _One liner_ -->

A React component to make transcribing audio and video easier and faster.

[![install size](https://packagephobia.now.sh/badge?p=@bbc/react-transcript-editor)](https://packagephobia.now.sh/result?p=@bbc/react-transcript-editor)

The project uses [this github project board to organise and the co-ordinate development](https://github.com/bbc/react-transcript-editor/projects/1).

_--> Work in progress <--_

<!-- _Screenshot of UI - optional_ -->

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

<!-- git clone git@github.com:bbc/react-transcript-editor.git -->

> To start the development server (with entry point `src/index.js`), run

```
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

## Usage - production

<!-- npm install react-transcript-editor -->

<!-- exampel usage - require etc.. -->
<!-- https://www.npmjs.com/package/@bbc/react-transcript-editor -->

Available on [npm - `@bbc/react-transcript-editor`](https://www.npmjs.com/package/@bbc/react-transcript-editor)

```
npm install @bbc/react-transcript-editor
```

```js
import { TranscriptEditor } from '@bbc/react-transcript-editor';

  <TranscriptEditor
     transcriptData=// Transcript json
     mediaUrl=// string url to media file - audio or video 
     isEditable={true}// se to true if you want to be able to edit the text
     sttJsonType={ 'bbckaldi' }// the type of STT Json transcript supported.
     handleAnalyticsEvents={ this.handleAnalyticsEvents } // optional - if you want to collect analytics events.
     fileName=// optional - used for saving and retrieving local storage blob files 
     title=// optional - defaults to ''
     ref= // optional - if you want to have access to internal functions such as retrieving content from the editor. eg to save to a server/db.
   />
```
See [`./src/index.js` demo](./src/index.js) as a more detailed example usage of the component.

_Note: `fileName` it is optional but it's needed if working with user uploaded local media in the browser, to be able to save and retrieve from local storage. For instance if you are passing a blob url to `mediaUrl` using `createObjectURL` this url is randomly re-generated on every page refresh so you wouldn't be able to restore a session, as `mediaUrl` is used as the local storage key. See demo app for more detail example of this[`./src/index.js`](./src/index.js)_

### Typescript projects

If using in a parent project where [typescript](https://www.typescriptlang.org/) is being used you might need to add `//@ts-ignore` before the import statment like this

```js
//@ts-ignore
import { TranscriptEditor } from "@bbc/react-transcript-editor";
```

## System Architecture

<!-- _High level overview of system architecture_ -->

uses [`create-component-lib`](https://www.npmjs.com/package/create-component-lib) as explaied in this [blog post](https://hackernoon.com/creating-a-library-of-react-components-using-create-react-app-without-ejecting-d182df690c6b) to setup the environment to develop this React.

This uses [Create React App 2.0](https://reactjs.org/blog/2018/10/01/create-react-app-v2.html) so we are using [CSS Modules](https://github.com/css-modules/css-modules) to contain the scope of the css for this component.
<!-- 
Uses CSS grid-layout https://medium.com/samsung-internet-dev/common-responsive-layouts-with-css-grid-and-some-without-245a862f48df -->

> Place everything you want to publish to npm inside `src/lib`.

> Outside `src/lib` (but inside src/), you can create example web pages to test or demonstrate the usage of your components.

## Documentation

There's a [docs](./docs) folder in this repository.

[docs/notes](./docs/notes) contains dev notes on various aspects of the project.

[docs/adr](./docs/adr) contains [Architecture Decision Record](https://github.com/joelparkerhenderson/architecture_decision_record).

> An architectural decision record (ADR) is a document that captures an important architectural decision made along with its context and consequences.

We are using [this template for ADR](https://gist.github.com/iaincollins/92923cc2c309c2751aea6f1b34b31d95)

[There also QA testing docs](./docs/qa/README.md) to manual test the component before a major release, (QA testing does not require any technical knowledge).

## Build

<!-- _How to run build_ -->

> To transpile `src/lib` and create a build in the dist folder, run:

```
npm run build:component
```

## Demo

Demo can be viewed at [https://bbc.github.io/react-transcript-editor](https://bbc.github.io/react-transcript-editor)

<!-- https://github.com/gitname/react-gh-pages
-->

## Build - demo

This github repository uses [github pages](https://pages.github.com/) to host a demo of the component, in [docs/demo](./docs/demo)

```
npm run deploy:ghpages
```

add to git, and push to origin master to update

<!-- https://help.github.com/articles/user-organization-and-project-pages/#project-pages-sites -->

Alternatively If you simply want to build the demo locally in the `build` folder then just

```
npm run build:example
```

## Tests

<!-- _How to carry out tests_ -->

Test coverage using [`jest`](https://jestjs.io/), to run tests

```
npm run test
```

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

## Legal Disclaimer

Despite using React and DraftJs, the BBC is not promoting any Facebook products or other commercial interest.
