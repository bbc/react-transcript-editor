import React from 'react';
import { render, cleanup } from 'react-testing-library';
import { shallow } from 'enzyme';

import MediaPlayer from './index.js';

afterEach(cleanup);

videoRef = React.createRef();

const fakeUrl = "https://storage.googleapis.com/coverr-main/mp4/Pigeon-Impossible.mp4";
const fakeVideoUrl = <video ref={ videoRef } src={url}></video>;

xtest('GIVEN a chapter title I expect that WHEN the Video component is rendered THEN the correct title is displayed', () => {
  const { container } = render(<MediaPlayer videoRef={videoRef} mediaUrl={ fakeUrl } />);

  expect(container.innerHTML).toContain('videoSection');
});

xtest("GIVEN a video as a chapter with src video url THEN the video is rendered fakeUrl it's source url", () => {
  const { getByTestId } = render(<MediaPlayer videoRef={videoRef} mediaUrl={ fakeVideoUrl } />);

  expect(getByTestId('media-player-id').attributes.src.value).toBe(fakeUrl);
});
xtest('WHEN the Video component is rendered THEN a video element is displayed', () => {
  const wrapper = shallow(<MediaPlayer videoRef={videoRef} mediaUrl={ fakeUrl } />);
  expect(wrapper.find('video').type()).toBe('video');
});
