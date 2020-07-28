# Analytics

The `TranscriptEditor` component has an optional setup to track some analytics events around the usage of the main functionalities.

As you can see in the demo app at `/src/index.js` there is an optional `handleAnalyticsEvents`.

```js
<TranscriptEditor
  transcriptData={this.state.transcriptData}
  mediaUrl={this.state.mediaUrl}
  isEditable={this.state.isTextEditable}
  sttJsonType={this.state.sttType}
  handleAnalyticsEvents={this.handleAnalyticsEvents} //<--
  ref={"transcriptEditor"}
/>
```

It returns an object, which in the example we are adding to an array. and displaying at the [bottom of the demo page](https://bbc.github.io/react-transcript-editor/) in a `textarea`.

Here's an example of the output

```json
[
  {
    "category": "TimedTextEditor",
    "action": "setEditorContentState",
    "name": "getWordCount",
    "value": 1712
  },
  {
    "category": "MediaPlayer",
    "action": "onLoadedDataGetDuration",
    "name": "durationInSeconds-WithoutOffset",
    "value": "00:11:51:07"
  },
  {
    "category": "WrapperBlock",
    "action": "handleTimecodeClick",
    "name": "onWordClick",
    "value": "00:00:31:20"
  },
  {
    "category": "MediaPlayer",
    "action": "pauseMedia",
    "name": "pauseMedia",
    "value": "00:00:31:20"
  }
]
```

This data is what you can send to your analytics system/provider. Eg if you are using [piwik/matomo](https://matomo.org/free-software/) with the js sdk then you could setup an handler like this to track individual events with their dashboard.

```js
handleAnalyticsEvents = (event) => {
  if (window.location.hostname !== "localhost") {
    _paq.push([
      "trackEvent",
      event.category,
      event.action,
      event.name,
      event.value,
    ]);
  }
};
```
