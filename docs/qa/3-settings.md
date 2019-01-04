### Item to test #3: Settings

#### Item to test #3.1: Settings - show

##### Steps:
- click on settings, cog  icon top right
##### Expected Results: 
-  [ ] Expect settings panel to come up 

#### Item to test #3.2: Settings - hide

##### Steps:
- click on settings panel cross, top right
##### Expected Results: 
-  [ ] Expect settings panel to hide

#### Item to test #3.3: Settings - pause while typing - on

##### Steps:
- click settings icon top right
- in settings panel, click toggle for "pause while typing" to be on
- in TimedTextEditor double click on a word, media starts playing
- start typing to correct a word
#### #Expected Results: 
- [ ] Expect media to pause while typing
- [ ] Expect media to re-start a few seconds after stopped typing

#### Item to test #3.4: Settings - pause while typing - off

##### Steps:
- click settings icon top right
- in settings panel, click toggle for "pause while typing" to be off
- in TimedTextEditor double click on a word, media starts playing
- start typing to correct a word
##### Expected Results: 
- [ ] Expect media not to pause while typing, and continue playing

#### Item to test #3.5: Settings - scroll sync - on
scroll into view 

##### Steps:
- click settings icon top right
- in settings panel, click toggle for "scroll sync" to be on 
- in TimedTextEditor click on progress bar, further away from current playhead
##### Expected Results: 
- [ ] Expect text in timed text editor in view to jump to corresponding current time

#### Item to test #3.6: Settings - scroll sync - off

##### Steps:
- click settings icon top right
- in settings panel, click toggle for "scroll sync" to be off 
- in TimedTextEditor click on progress bar, further away from current playhead
##### Expected Results: 
- [ ] Expect text in timed text editor in view not to jump to corresponding current time

#### Item to test #3.7: Settings - set roll back interval

##### Steps:
- click settings icon top right
- in settings panel, change value of 'Rollback Interval (sec)', something other then default 15 seconds
- Make sure media current time is not zero
- Click on roll back btn 
##### Expected Results: 
-  [ ] Expect current time to roll back by the the custom ammount set in previous steps
- [ ] Expect progress bar, media preview, and timed text editor words hilight to update accordingly


#### Item to test #3.8: Settings - Show/hide timecodes - off

##### Steps:
- click settings icon top right
- in settings panel, toggle 'Show Timecodes' to be off
##### Expected Results: 
-  [ ] Expect timecodes to disappear in timed text editor

####  Item to test #3.9: Settings - Show/hide timecodes - on

##### Steps:
- click settings icon top right
- in settings panel, toggle 'Show Timecodes' to be on
##### Expected Results: 
-  [ ] Expect timecodes to appear in timed text editor

#### Item to test #3.10: Settings - Show/hide speaker labels -off

##### Steps:
- click settings icon top right
- in settings panel, toggle 'Show Speaker Labels' to be off
##### Expected Results: 
-  [ ] Expect speaker labels to disappear in timed text editor

#### Item to test #3.11: Settings - Show/hide speaker labels -on

#### Steps:
- click settings icon top right
- in settings panel, toggle 'Show Speaker Labels' to be on
#### Expected Results: 
-  [ ] Expect speaker labels to appear in timed text editor

#### Item to test #3.12: Settings - Set timcode offset - set

##### Steps:
- click settings icon top right
- in settings panel, change the 'Timecode Offset ' from default `00:00:00:00` eg to `01:00:00:00`
- click save
- close settings panel, clicking top right cross 
##### Expected Results: 
- [ ] Expect timecode offset to added to current time, eg if progress bar is at beginning should see `01:00:00:00`
- [ ] Expect timecode offset to added to duration
- [ ] Expect timecode offset to added to timecodes at paragraph level (Show Timecodes needs to be on to inspect this)


#### Item to test #3.13 Settings - Set timcode offset - reset

##### Steps:
-  follow setup steps of previous 'Settings - Set timcode offset - set'
-  then click 'reset'
##### Expected Results: 
- [ ] Expect timecode offset to be removed from current time, eg if progress bar is at beginning should see `00:00:00:00`
- [ ] Expect timecode offset to removed to duration
- [ ] Expect timecode offset to be removed from timecodes at paragraph level (Show Timecodes needs to be on to inspect this)
