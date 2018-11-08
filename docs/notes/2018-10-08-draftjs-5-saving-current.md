# Saving DraftJs current data

> also, if you want to save the edited data, to get that JSON back of blocks, entityMap, etc. is just `const data = convertToRaw(editorState.getCurrentContent());`

---
> Import convertToRaw the same way you import convertFromRaw then you can iterate that data do to various things I have somewhere code to do bbc transcript model out of that it is a monster like https://github.com/bbc/subtitalizer/blob/d102c233236b782011a4a94a21e6de13491abb45/src/components/TranscriptEditor.js#L105-L241but basically, you have to take each block and split the text on space, then find what entity range covers each word then get the timing data.
