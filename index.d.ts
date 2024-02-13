// index.d.ts

declare module '@kmoz000/react-transcript-editor' {
  import { FunctionComponent } from 'react';

  // Define the main props for the TranscriptEditor component
  interface TranscriptEditorProps {
    transcripts: string[]; // Array of transcript strings
    title?: string; // Optional title prop based on stories
    mediaUrl?: string; // Optional mediaUrl prop based on stories
    sttJsonType?: string; // Optional sttJsonType prop based on stories
    isEditable?: boolean; // Optional isEditable prop based on stories
    spellCheck?: boolean; // Optional spellCheck prop based on stories
    fileName?: string; // Optional fileName prop based on stories
    handleAnalyticsEvents?: () => void; // Optional analytics event handler based on stories
    handleAutoSaveChanges?: () => void; // Optional auto-save change handler based on stories
    autoSaveContentType?: string; // Optional auto-save content type prop based on stories
    mediaType?: 'audio' | 'video'; // Optional media type prop based on stories
  }

  // Export the TranscriptEditor component with its props
  export const TranscriptEditor: FunctionComponent<TranscriptEditorProps>;

  // Define the main props for the TimedTextEditor component
  interface TimedTextEditorProps {
    transcriptData: any; // Update the type as needed
    isEditable?: boolean;
    spellCheck?: boolean;
    onWordClick?: (a?:any|undefined) => void;
    sttJsonType?: string;
    isPlaying?: (a?:any|undefined) => void;
    playMedia?: (a?:any|undefined) => void;
    currentTime?: number;
    isScrollIntoViewOn?: boolean;
    isPauseWhileTypingOn?: boolean;
    timecodeOffset?: number;
    handleAnalyticsEvents?: (a:any) => void;
    showSpeakers?: boolean;
    showTimecodes?: boolean;
    fileName?: string;
    ref?:React.RefObject<React.FunctionComponent<TimedTextEditorProps>>,
    mediaType: "audio"|"video"
  }

  // Export the TimedTextEditor component with its props
  export const TimedTextEditor: FunctionComponent<TimedTextEditorProps>;

  // Define the main props for the Settings component
  interface SettingsProps {
    handleSettingsToggle: () => void;
    showTimecodes: boolean;
    showSpeakers: boolean;
    timecodeOffset: number;
    defaultValueScrollSync: boolean;
    defaultValuePauseWhileTyping: boolean;
    defaultRollBackValueInSeconds: number;
    previewIsDisplayed: boolean;
    handleShowTimecodes: () => void;
    handleShowSpeakers: () => void;
    handleSetTimecodeOffset: () => void;
    handlePauseWhileTyping: () => void;
    handleIsScrollIntoViewChange: () => void;
    handleRollBackValueInSeconds: () => void;
    handlePreviewIsDisplayed: () => void;
    handleChangePreviewViewWidth: () => void;
    handleAnalyticsEvents: () => void;
  }

  // Export the Settings component with its props
  export const Settings: FunctionComponent<SettingsProps>;

  // Define the main props for the KeyboardShortcuts component
  interface KeyboardShortcutsProps {
    handleShortcutsToggle: () => void;
  }

  // Export the KeyboardShortcuts component with its props
  export const KeyboardShortcuts: FunctionComponent<KeyboardShortcutsProps>;
}
