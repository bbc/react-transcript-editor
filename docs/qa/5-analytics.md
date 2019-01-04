### Item to test #5: Analytics

Analytics in[the demo app](https://bbc.github.io/react-transcript-editor/) are logged in a text area below the component for demonstration purposes.
This can also be used to test tha they are fulling working.

Every new event return an object into an array in the text area. 
Inspecting the array for new elements gives a good indication of whether all expected events are being tracked. eg if an event is not in the array list then the code might not be working as expected.

Here's a list of events grouped by functionality. It might be easier to test one at a time, or if already done the test for above items, can just review the array generated so far to see if any of these are missing.

##### info
- [ ] duration of media
- [ ] number of words in transcript

_these we'd expect to be triggered first_

##### actions
- [ ] click on progress bar
- [ ] double click on word // now also triggered when  clicking on time-codes
- [ ] click on time-codes, at paragraph level
- [ ] Set current time, Jump to time, click on current time display 
- [ ] play/pause, click on media preview // but triggered by other events as well
- [ ] playback speed change
- [ ] use of keyboard shortcuts // see keyboard shortcut cheat sheet and test each individually
- [ ] edit speaker label 
- [ ] ~skip forward~
- [ ] ~skip backward~

##### settings
- [ ] set timecode offset
- [ ] pause while typing
- [ ] scroll into view

- [ ] rollback 
- [ ] Toggles speaker names - show/hide 
