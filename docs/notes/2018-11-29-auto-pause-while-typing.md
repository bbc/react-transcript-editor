# auto pause while typing implementation notes - draft

Notes Pause while typing 

## MediaPlayer 
Expose `isPlaying` and `playMedia` from `MediaPlayer` through parent component `TranscriptEditor` To other `TimedTextEditor` to allow the setup for external controls 

Change playMedia to accommodate optional `bool`
`True` -> play 
`False` -> pause 

If `bool` not provided and if `playMedia` triggered by btn or video element then can use detecting `.target` attribute to distinguish who is calling the function.
 
Play if paused | pause if playing.

### Toggle 
Added toggle for pause while typing to make it optional


### In timedTextEditor
[from issue](https://github.com/facebook/draft-js/issues/1060)
```js
onChange = (editorState) => {
    if(this.state.editorState.getCurrentContent() !== editorState.getCurrentContent()){
```

Using comparison of previous and current content state to check if content has changed. and therefore if the user is typing.

Proved more effective [then checking change type](https://draftjs.org/docs/api-reference-editor-state#lastchangetype) from [draft docs](https://draftjs.org/docs/api-reference-editor-change-type), which has more edge cases. 

another option is to use `editorStateChangeType === 'insert-characters'`  but this seems to be triggered even outside of draftJS eg when clicking play button.

at pseudo code level then we do 
- when onChange 
- Trigger pause, MediaPlayer 
- Clear timer 
- After 2 sec trigger playMedia 

This means that if user keeps typing, the timer keeps getting set and reset. Keeping the media paused.

When the user stops typing after 2 sec it start playing again 