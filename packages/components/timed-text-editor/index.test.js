import React from 'react';
import { render, cleanup, } from 'react-testing-library';
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
  it('renders the editor sections correctly', async () => {
    const { getByTestId } = render(<TimeTextEditor { ...defaultProps }/>);
    getByTestId('section-editor');
    getByTestId('section-style');
  });
});
