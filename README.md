# BBC Transcript Editor

> A collection of React components for a fully-featured Transcript Editor

[![install size](https://packagephobia.now.sh/badge?p=@bbc/react-transcript-editor)](https://packagephobia.now.sh/result?p=@bbc/react-transcript-editor)

The project uses [this github project board to organise and the co-ordinate development](https://github.com/bbc/react-transcript-editor/projects/1).

## Development env

- yarn > `1.12.3`
- [Node 10 - dubnium](https://scotch.io/tutorials/whats-new-in-node-10-dubnium)

Node version is set in node version manager [`.nvmrc`](https://github.com/creationix/nvm#nvmrc)

## Setup

Fork this repository + git clone + cd into folder

## Usage - development

> Local development is done via [Storybook](https://storybook.js.org/), and can be launched with:

```
$ yarn storybook
```

Visit [http://localhost:6006](http://localhost:6006) to see the full Storybook, browse the components, and use the demo application.

## Usage - production

All packages in this monorepo are available on [npm](https://www.npmjs.com/org/@bbc-transcript-editor under the `@bbc-transcript-editor` org. You can install each one indepedently if you wish to build up your own UI using some of these components, or you can install the fully composed editor, as below:

```
# Yarn
yarn add @bbc-transcript-editor/editor

# NPM
npm install @bbc-transcript-editor/editor
```

```js
import TranscriptEditor from '@bbc-transcript-editor/editor';

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

_Note: `fileName` it is optional but it's needed if working with user uploaded local media in the browser, to be able to save and retrieve from local storage. For instance if you are passing a blob url to `mediaUrl` using `createObjectURL` this url is randomly re-generated on every page refresh so you wouldn't be able to restore a session, as `mediaUrl` is used as the local storage key._

### Typescript projects

If using in a parent project where [typescript](https://www.typescriptlang.org/) is being used you might need to add `//@ts-ignore` before the import statment like this

```js
//@ts-ignore
import TranscriptEditor from "@bbc-transcript-editor/editor";
```

## System Architecture

This monorepo uses Lerna and Yarn Workspaces to create a set of individual packages, each one a single component (or small bundle of components).

## Documentation

There's a [docs](./docs) folder in this repository.

[docs/notes](./docs/notes) contains dev notes on various aspects of the project.

[docs/adr](./docs/adr) contains [Architecture Decision Record](https://github.com/joelparkerhenderson/architecture_decision_record).

> An architectural decision record (ADR) is a document that captures an important architectural decision made along with its context and consequences.

We are using [this template for ADR](https://gist.github.com/iaincollins/92923cc2c309c2751aea6f1b34b31d95)

[There also QA testing docs](./docs/qa/README.md) to manual test the component before a major release, (QA testing does not require any technical knowledge).

## Build

> To build each component ready for distribution via NPM, run:

```
# TBC
```

> You can also build the Storybook as a static site using:

```
$ yarn storybook:build
```

## Demo

Demo can be viewed at [https://bbc.github.io/react-transcript-editor](https://bbc.github.io/react-transcript-editor)

## Tests

Tests are written using [`jest`](https://jestjs.io/), and can be run across all packages using the following command:

```
$ yarn test
```

## Deployment

- TBC

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) guidelines.

## Licence

See [LICENCE.md](./LICENCE.md)

## Legal Disclaimer

Despite using React and DraftJs, the BBC is not promoting any Facebook products or other commercial interest.
