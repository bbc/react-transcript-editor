
#### 0.Component Interface

As initially surfaced in this issue [#87](https://github.com/bbc/react-transcript-editor/issues/87)

The component at a minimum needs two params to function properly and to be able to save to local storage. Transcript as `transcriptData` (+ `sttJsonType`) and media as`mediaUrl`.

We'd normally expect both to be provided at the same time, but there might be edge case where the component is initialized with the first one, and then subsequently receives the second one (or the other way around).

This QA section shows how to use the demo app to test that this works as expected.

[To begin visit the demo app at](https://bbc.github.io/react-transcript-editor/ )


####  Both at same time - media+transcript

##### Steps:
- [ ] click 'clear local storage'
- [ ] 'Load demo'
- [ ] Edit text
- [ ] refresh browser
- [ ] 'Load demo'
##### Expected Results: 
- [ ] wait 5 seconds
- [ ] Expect the text change in step 3 to have persisted


####  Media first - local media

##### Steps:
- [ ] click 'clear local storage'
- [ ] 'Load Local Media' + 'Chose File'
- [ ] 'open Transcript Json' + 'Choose file'
- [ ] Edit text
- [ ] refresh browser
- [ ] repeat step 2 and 3
##### Expected Results: 
- [ ] wait 5 seconds
- [ ] Expect the text change in step 4 to have persisted


####  Media first - url

##### Steps:
- [ ] click 'clear local storage'
- [ ] 'Load media from Url'  and add this url: https://download.ted.com/talks/KateDarling_2018S-950k.mp4
- [ ] 'open Transcript Json' + 'Choose file'
- [ ] Edit text
- [ ] refresh browser
- [ ] repeat step 2 and 3
##### Expected Results: 
- [ ] wait 5 seconds
- [ ] Expect the text change in step 4 to have persisted


####  Transcript first - local media

##### Steps:
- [ ] click 'clear local storage'
- [ ] 'open Transcript Json' + 'Choose file'
- [ ] 'Load Local Media' + 'Chose File'
- [ ] Edit text
- [ ] refresh browser
- [ ] repeat step 2 and 3
##### Expected Results: 
- [ ] wait 5 seconds
- [ ] Expect the text change in step 4 to have persisted

#### Transcript first - url 

##### Steps:
- [ ] click 'clear local storage'
- [ ] 'open Transcript Json' + 'Choose file'
- [ ] 'Load media from Url' 
- [ ] add this url: https://download.ted.com/talks/KateDarling_2018S-950k.mp4
- [ ] Edit text
- [ ] refresh browser
- [ ] repeat step 2 and 3
##### Expected Results: 
- [ ] wait 5 seconds
- [ ] Expect the text change in step 4 to have persisted

