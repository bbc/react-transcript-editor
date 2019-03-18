# Features List - draft

## User Facing

Player controls
- [x] play/pause  
- [x] Current time + duration display
- [X] Adjust Playback rate 
- [x] Jump to timecode <—  in timecode `hh:mm:ss:ms` format or (hh:mm:ss:ms hh:mm:ss mm:ss m:ss m.ss seconds)
- [x] Adjust timecodes <— set a timecode offset - default to zero  
- [x] [auto pause while typing](https://github.com/bbc/react-transcript-editor/issues/19) <-- 

<!-- - [ ] UI Turn off video preview (toggle on/off) -->
- [x] Roll back button 15 sec default, customizable amount 

Keyboard Shortcuts 
- [X] Keyboard Shortcuts 
- [ ] customizable Keyboard Shortcuts 

HyperTranscript - interactivity 
- [x] On text word double click at timecode -> media current time set to word timecode
- [x] [Words highlighted at current time](https://github.com/bbc/react-transcript-editor/issues/25) <— 
- [x] [Scroll Sync](https://github.com/bbc/react-transcript-editor/issues/34), keep current word in view <—  (toggle on/off) 
- [ ] Preserve timecodes while editing - TBC how

Transcript Extra Info
- [x] [Display Timecodes at paragraph level](https://github.com/bbc/react-transcript-editor/issues/26) (with offset if present)
- [x] [Display editable speaker names at paragraph level](https://github.com/bbc/react-transcript-editor/issues/26) - speaker diarization info 

Save
- [x] Save locally - (local storage)
- [x] Save locally - on interval, eg every `x` char 
- [ ] ~Save to server API end point - Btc~
- [ ] ~Save to server API end point - on interval~ 

Export <-- for proof of concept
- [X] Export plain text - without speaker names or timecodes
- [ ] Customizable Export plain text, eg with timecodes, speakers names etc..
    - [ ] with speaker names 
    - [ ] with timecodes
    - [ ] with timecodes & speaker names
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
- [x] autoEdit 2
- [x] AWS Transcriber
- [ ] Gentle Transcription 
- [ ] Gentle Alignment Json
- [ ] IBM Watson STT
- [X] Speechmatics
- [ ] AssemblyAI
- [ ] Rev
- [ ] Srt
- [ ] TTML
- [ ] VTT
- [ ] VTT (Youtube)
- [ ] IIIF 
- [ ] SMT and/or CTM ?<!-- SCLite -->

Export Transcript Json - Adapters 
- [ ] BBC Kaldi 
- [ ] News Labs API - BBC Kaldi
- [ ] autoEdit 2
- [ ] Gentle Transcription 
- [ ] Gentle Alignment Json
- [ ] IBM Watson STT
- [ ] Speechmatics
- [ ] AssemblyAI
- [ ] Rev
- [ ] Srt
- [ ] TTML
- [ ] VTT
- [ ] VTT (Youtube)
- [ ] IIIF 
- [ ] SMT and/or CTM ?

<!-- add Instructions on how to create adapters  -->

