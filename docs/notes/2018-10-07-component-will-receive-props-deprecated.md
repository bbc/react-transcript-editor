# `componentWillReceiveProps` deprecated 

https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html



use `getDerivedStateFromProps`


don't re-update the transcript if not chnaged
basically for now just don't update transcriptData if that is not null
we can massage that later for the odd case when you want to load another transcript

`this.state.transcriptData === null`

----

later `this.state.transcriptData !== nexProps.transcriptData` would be nicer but comparing objects like that is trickier unless you go to immutable.js or something for now just care about loading transcript once


----

also, if you want to save the edited data, to get that JSON back of blocks, entityMap, etc. is just `const data = convertToRaw(editorState.getCurrentContent());`

---
Import convertToRaw the same way you import convertFromRaw
then you can iterate that data do to various things
I have somewhere code to do bbc transcript model out of that
it is a monster like https://github.com/bbc/subtitalizer/blob/d102c233236b782011a4a94a21e6de13491abb45/src/components/TranscriptEditor.js#L105-L241