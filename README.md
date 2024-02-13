## React Transcript Editor `TS`

  <!-- Primary Meta Tags -->
  <meta name="title" content="React Transcript Editor TS - Audio and Video Transcription Component">
  <meta name="description" content="A React component designed to make transcribing audio and video content easier and faster.">


**`A React component to make transcribing audio and video easier and faster.`**

<p align="center">
  <a href="https://packagephobia.now.sh/result?p=@kmoz000/react-transcript-editor">
    <img src="https://badgen.net/packagephobia/install/@kmoz000/react-transcript-editor">
  </a>
  <a href="./package.json">
    <img src="https://img.shields.io/npm/v/@kmoz000/react-transcript-editor.svg?maxAge=3600&label=version&colorB=007ec6">
  </a>
</p>
<br/>


> In order to use a published version of `react-transcript-editor`,
install the published module [`@kmoz000/react-transcript-editor`](https://www.npmjs.com/package/@kmoz000/react-transcript-editor)
by running:

```bash
npm install @kmoz000/react-transcript-editor
```
_or_
```bash
yarn add @kmoz000/react-transcript-editor
```

---
**`Import`**
```js
import TranscriptEditor from "@kmoz000/react-transcript-editor";
```

---
**`Basic use case`**

```js
<TranscriptEditor
  transcriptData={someJsonFile}
  mediaUrl={"https://download.ted.com/talks/KateDarling_2018S-950k.mp4"}
/>
```

_`transcriptData` and `mediaUrl` are non-optional props to use `TranscriptEditor`.
See the full list of options [here](./packages/components/transcript-editor/stories/index.stories.js)_.

---
**`Advanced use case`**

```js
<TranscriptEditor
  transcriptData={someJsonFile}
  mediaUrl={"https://download.ted.com/talks/KateDarling_2018S-950k.mp4"}
  handleAutoSaveChanges={this.handleAutoSaveChanges}
  autoSaveContentType={"digitalpaperedit"}
  isEditable={true}
  spellCheck={false}
  sttJsonType={"bbckaldi"}
  handleAnalyticsEvents={this.handleAnalyticsEvents}
  fileName={"ted-talk.mp4"}
  title={"Ted Talk"}
  ref={this.transcriptEditorRef}
  mediaType={"video"}
/>
```

## Licence
<!-- mention MIT Licence -->
See [LICENCE](./LICENCE.md)

## Legal Disclaimer

_this package originaly created by BBC dev team and this is a maintained version with types support and less imports._
