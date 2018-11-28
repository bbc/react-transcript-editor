# highlight current words up to current time

It be awesome if there was a css selector that could be like less then this word timecode etc this seems the closest to it - but unfortunately is not that simple

- [x] need to get the currentTime as a prop into the `TimedTextEditor`.

- [ ] Then using `getDerivedStateFromProps` (the replacement for `componentWillReceiveProps`), we can compute what to highlights.

- [ ] By finding the block key and entity key of the currentTime, then inject CSS with tilda rule to make things things highlighted.

all the magic is done with `~` https://developer.mozilla.org/en-US/docs/Web/CSS/General_sibling_selectors


Laurian 
> The most efficient way is to inject CSS Otherwise if you do it via entity component, you have to refresh draftjs content and that gets slow in large transcripts

https://github.com/bbc/subtitalizer/blob/master/src/components/TranscriptEditor.js


```js
<style scoped>
    { `section[data-offset-key="${this.state.currentBlockKey}-0-0"] > .WrapperBlock > div[data-offset-key] { border-left: 8px solid #d9d9d9; }` }
    { `section[data-offset-key="${this.state.currentBlockKey}-0-0"] > .WrapperBlock > div[data-offset-key] > span { background-color: #d9d9d9; color: black; }` }
    { `section[data-offset-key="${this.state.playheadBlockKey}-0-0"] ~ section > .WrapperBlock > div[data-offset-key] > span { color: #696969; }` }
    { `span[data-entity-key="${this.state.playheadEntityKey}"] ~ span[data-entity-key] { color: #696969; }` }
    { `span[data-entity-key="${this.state.playheadEntityKey}"] ~ span[data-offset-key] { color: #696969; }` }
</style>
```

Also style scoped is not quite scoped in some browsers (only firefox has support for it) but that’s not an issue as we’re very specific in that css