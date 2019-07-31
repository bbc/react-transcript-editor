import TranscriptEditor from './components/transcript-editor/index.js';
import TimedTextEditor from './components/timed-text-editor/index.js';
import Settings from './components/settings/index.js';
import KeyboardShortcuts from './components/keyboard-shortcuts/index.js';
import VideoPlayer from './components/video-player/index.js';
import MediaPlayer from './components/media-player/index.js';
import PlayerControls from './components/media-player/src/PlayerControls/index.js';
import groupWordsInParagraphsBySpeakersDPE from './stt-adapters/digital-paper-edit/group-words-by-speakers.js';

import {
  secondsToTimecode,
  timecodeToSeconds,
  shortTimecode
} from './util/timecode-converter/index.js';

import exportAdapter from './export-adapters/index.js';
import sttJsonAdapter from './stt-adapters/index.js';

export default TranscriptEditor;

export {
  TranscriptEditor,
  TimedTextEditor,
  VideoPlayer,
  MediaPlayer,
  PlayerControls,
  Settings,
  KeyboardShortcuts,
  secondsToTimecode,
  timecodeToSeconds,
  shortTimecode,
  exportAdapter,
  sttJsonAdapter,
  groupWordsInParagraphsBySpeakersDPE
};
