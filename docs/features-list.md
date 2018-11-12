# Features List - draft

## User Facing

Player controls
- [x] play/pause  
- [x] Current time + duration display
- [X] Adjust Playback rate 
- [x] Jump to timecode <—  in timecode `hh:mm:ss:ms` format or (hh:mm:ss:ms hh:mm:ss mm:ss m:ss m.ss seconds)
- [x] Adjust timecodes <— set a timecode offset - default to zero  

<!-- - [ ] UI Turn off video preview (toggle on/off) -->
- [x] Roll back button 15 sec default, customizable amount 

Keyboard Shortcuts 
- [X] Keyboard Shortcuts 
- [ ] customizable Keyboard Shortcuts 

HyperTranscript - interactivity 
- [x] On text word doubel click at timecode -> media current time set to word timecode
- [ ] Words highlighted at current time <— 
- [ ] Preserve timecodes while editing - TBC how

Transcript Extra Info
- [ ] Display Timecodes at paragraph level (with offset if present)
- [ ] Display editable speaker names at paragraph level - speaker diarization info 

Save
- [ ] Save locally - btc
- [ ] Save locally - on interval 
- [ ] Save to server API end point - Btc
- [ ] Save to server API end point - on interval 

Export <-- for proof of concept
- [ ] Export plain text
- [ ] Customizable Export plain text, eg with timecodes, speakers names etc..
- [ ] Other?


Mobile First
- [ ] Works on mobile 

Browser compatibility
- [X] Works on Chrome
- [ ] Windows Explorer IE

## Dev 

Import Transcript Json - Adapters 
- [x] BBC Kaldi 
- [x] News Labs API - BBC Kaldi
- [ ] autoEdit 2
- [ ] Gentle Transcription (different from Gentle Alignment Json)
- [ ] IBM Watson STT
- [ ] Speechmatics
- [ ] Rev
- [ ] Srt
- [ ] SMT and/or CTM ?<!-- SCLite -->

Export Transcript Json - Adapters 
- [ ] BBC Kaldi 
- [ ] News Labs API - BBC Kaldi
- [ ] autoEdit 2
- [ ] srt

<!-- add Instructions on how to create adapters  -->

