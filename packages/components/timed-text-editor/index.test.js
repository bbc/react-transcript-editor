import React from 'react';
import { render, cleanup } from 'react-testing-library';
import TimeTextEditor from './index';

import bbcKaldiTranscript from './stories/fixtures/bbc-kaldi.json';

const mediaUrl = 'https://download.ted.com/talks/KateDarling_2018S-950k.mp4';

const defaultProps = {
  transcriptData: bbcKaldiTranscript,
  mediaUrl: mediaUrl,
  isEditable: true,
  spellCheck: false,
  onWordClick: () => {},
  sttJsonType: 'bbckaldi',
  isPlaying: () => {},
  playMedia: () => {},
  currentTime: 0,
  isScrollIntoViewOn: true,
  isPauseWhileTypingOn: true,
  timecodeOffset: 0,
  handleAnalyticsEvents: () => {},
  showSpeakers: true,
  showTimecodes: true,
  fileName: 'KateDarling_2018S-950k.mp4'
};

afterEach(cleanup);

describe('TimeTextEditor', () => {
  it('renders the editor correctly', () => {
    const { getByText } = render(<TimeTextEditor { ...defaultProps }/>);
    getByText('');
  });

  it('realigns the timecodes of text when text is written to');
  it('realigns the timecodes of text when text is deleted');
  it('pops up a modal when the speaker is selected');
  it('edits the speaker');
  it('underlines the time codes on hover');
  it('creates a new block of text when the "enter" is inserted');

});