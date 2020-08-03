# Features List

## User Interface

### Player controls

- [x] play/pause
- [x] Current time + duration display
- [x] Adjust Playback rate
- [x] Jump to timecode
  - in timecode `hh:mm:ss:ms` format or `hh:mm:ss:ms hh:mm:ss mm:ss m:ss m.ss seconds`)
- [x] Adjust timecodes
  - configurable in the settings menu
  - default to `00:00:00:00`
- [x] Roll back button
  - configurable in the settings menu
  - default to 15 seconds
- [x] [auto pause while typing](https://github.com/bbc/react-transcript-editor/issues/19) (adjustable in the settings menu - default to `on`)
  <!-- - [ ] UI Turn off video preview (toggle on/off) -->

### Keyboard Shortcuts

- [x] Keyboard Shortcuts
- [ ] customizable Keyboard Shortcuts

### HyperTranscript - interactivity

- [x] Set media time by double clicking on a word
- [x] [Words highlighted at current time](https://github.com/bbc/react-transcript-editor/issues/25) <—
- [x] [Scroll Sync](https://github.com/bbc/react-transcript-editor/issues/34)
  - Keep current word in view
  - default `off`
  - configurable in the settings menu
- [ ] Preserve timecodes while editing

### Transcript Extra Info

- [x] [Display Timecodes at paragraph level](https://github.com/bbc/react-transcript-editor/issues/26) (with offset if present)
- [x] [Display editable speaker names at paragraph level](https://github.com/bbc/react-transcript-editor/issues/26) - speaker diarization info

### Save

- [x] Save locally to local storage
  - [x] On interval, e.g. every `x` char

### Export (for proof of concept)

- [x] Export plain text
  - [x] without speaker names or timecodes
  - [x] with speaker names and timecodes
- [x] Captions
  - [x] JSON
  - [x] CSV
  - [x] Adobe Premiere
  - [x] SRT
  - [x] TTML
  - [x] VTT
  - [x] [Digital Paper Edit](https://www.github.com/bbc/digital-paper-edit-client)
- [ ] Customizable Export plain text, eg with timecodes, speakers names etc..
  - [ ] with speaker names
  - [ ] with timecodes
  - [ ] with timecodes & speaker names

### Mobile First

- [x] Works on mobile

### Browser compatibility

- [x] Chrome
- [ ] Firefox
- [ ] Internet Explorer

## Dev

### Import Transcript Json - Adapters

- [x] BBC Kaldi
- [x] News Labs API - BBC Kaldi
- [x] autoEdit 2
- [x] AWS Transcriber
- [x] IBM Watson STT
- [x] Speechmatics
- [ ] Gentle Transcription
- [ ] Gentle Alignment Json
- [ ] AssemblyAI
- [ ] Rev
- [ ] 3play Media Json
- [ ] Srt
- [ ] TTML
- [ ] VTT
- [ ] VTT (Youtube)
- [ ] IIIF
- [ ] SMT and/or CTM ?<!-- SCLite -->

### Export Transcript Json - Adapters

- [ ] BBC Kaldi
- [ ] News Labs API - BBC Kaldi
- [ ] autoEdit 2
- [ ] Gentle Transcription
- [ ] Gentle Alignment Json
- [ ] IBM Watson STT
- [ ] Speechmatics
- [ ] AssemblyAI
- [ ] Rev
- [ ] 3play Media Json
- [ ] Srt
- [ ] TTML
- [ ] VTT
- [ ] VTT (Youtube)
- [ ] IIIF
- [ ] SMT and/or CTM ?

You can add adapters - [see guide](./guides/adapters.md).
