From Luke: 
> hmm, i think if you were doing this is as a component to share i would maybe avoid including a layer of analytics calls, and just have it raise events when certain things happen (ie. the sorts of things you'd want to track in analytics) then in an implementation people can just catch whatever events they are interested in and pass them to the analytics lib of their choice

> i think you generally want to use the pattern of adding event handlers as props so that they 'bubble up' to the component which mounted them


The component gets an extra call back to catch these events internally `handleAnalyticsEvents={ this.handleAnalyticsEvents }` in the parent application 

```js
<TranscriptEditor
transcriptData={ this.state.transcriptData }
mediaUrl={ this.state.mediaUrl }
isEditable={ this.state.isTextEditable }
sttJsonType={ this.state.sttType }
ref={ 'transcriptEditor' }
handleAnalyticsEvents={ this.handleAnalyticsEvents }
/>
```

eg 

```js
handleAnalyticsEvents = (event) => {
console.log(event)
    const tmpAnalyticsEventslist = this.state.analyticsEvents;
    tmpAnalyticsEventslist.push(event);
    this.setState({
        analyticsEvents: tmpAnalyticsEventslist
    })
} 
```


Then in `TranscriptEditor` for example can use `this.props.handleAnalyticsEvents` like so

```js
  handleWordClick = (startTime) => {
    this.props.handleAnalyticsEvents({ category: 'TranscriptEditor', action: 'doubleClickOnWord', name: '', value: startTime })
    this.setCurrentTime(startTime);
  }
```

We are using attributes inspired by the [Piwik/matomo fields]( https://developer.matomo.org/api-reference/tracking-api )
also see [tracking-events in matomo](https://matomo.org/docs/event-tracking/#tracking-events)


At the top parent component level this would return objects that cab grouped like so , eg `handleAnalyticsEvents` described above.
And these can be sent to the analytics library of choice. 

```json 
[
  {
    "category": "TranscriptEditor",
    "action": "doubleClickOnWord",
    "name": "",
    "value": 13.02
  },
  {
    "category": "MediaPlayer",
    "action": "promptSetCurrentTime",
    "name": "jumpToTime",
    "value": "2.3"
  },
  {
    "category": "MediaPlayer",
    "action": "setTimeCodeOffset",
    "name": "timecodeOffsetValue",
    "value": "01:00:00:00"
  },
  {
    "category": "MediaPlayer",
    "action": "handleToggleScrollIntoView",
    "name": "",
    "value": ""
  },
  {
    "category": "MediaPlayer",
    "action": "handleToggleScrollIntoView",
    "name": "",
    "value": ""
  },
  {
    "category": "MediaPlayer",
    "action": "handleTogglePauseWhileTyping",
    "name": "",
    "value": ""
  },
  {
    "category": "MediaPlayer",
    "action": "handleTogglePauseWhileTyping",
    "name": "",
    "value": ""
  },
  {
    "category": "MediaPlayer",
    "action": "handleTogglePauseWhileTyping",
    "name": "",
    "value": ""
  },
  {
    "category": "MediaPlayer",
    "action": "handleTogglePauseWhileTyping",
    "name": "",
    "value": ""
  },
  {
    "category": "MediaPlayer",
    "action": "setPlayBackRate",
    "name": "playbackRateNewValue",
    "value": "1.2"
  },
  {
    "category": "MediaPlayer",
    "action": "setPlayBackRate",
    "name": "playbackRateNewValue",
    "value": "2.2"
  },
  {
    "category": "MediaPlayer",
    "action": "setPlayBackRate",
    "name": "playbackRateNewValue",
    "value": "3.2"
  },
  {
    "category": "MediaPlayer",
    "action": "setPlayBackRate",
    "name": "playbackRateNewValue",
    "value": 1
  },
  {
    "category": "MediaPlayer",
    "action": "rollBack",
    "name": "rollBackValue",
    "value": "52"
  },
  {
    "category": "MediaPlayer",
    "action": "rollBack",
    "name": "rollBackValue",
    "value": "13"
  }
]
```