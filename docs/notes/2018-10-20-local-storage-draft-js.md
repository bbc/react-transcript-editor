2018-11-20-local-saving-to-local-storage-on-keystroke.md

# saving to local storage on keystroke

Getting data 

```js
const data = convertToRaw(editorState.getCurrentContent());
```


Import `convertToRaw` the same way you import `convertFromRaw` then you can iterate that data do to various things

eg in bbc transcript model https://github.com/bbc/subtitalizer/blob/d102c233236b782011a4a94a21e6de13491abb45/src/components/TranscriptEditor.js#L105-L241

so, you need to get JSON of that content state, store that in localstorage, and use that to load into draft back.

So, basically 

https://github.com/bbc/subtitalizer/blob/d102c233236b782011a4a94a21e6de13491abb45/src/components/TranscriptEditor.js#L105-L241

without the Immutable things



## how often to save? saving on every keystroke?

it will make it slow, can do debounce to improve perfroamce


```js
this.debouncedRebuildTranscript = debounce(this.rebuildTranscript, 100);
```


https://github.com/bbc/subtitalizer/blob/d102c233236b782011a4a94a21e6de13491abb45/src/components/TranscriptEditor.js#L266

```js
import debounce from 'lodash.debounce';
```

[https://lodash.com/docs/4.17.11](https://lodash.com/docs/4.17.11) - [debounce](https://lodash.com/docs#debounce)

This as you type, it postpones that until you do a 100ms pause in this example.

Laurian 
> Do it without, then test and see if you need it, but there is a lot of computation to do on a keystroke, and JS is single threaded