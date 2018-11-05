import React from 'react';
import { render, cleanup } from 'react-testing-library';
import { shallow } from 'enzyme';
import MediaPreview from './MediaPreview';
afterEach(cleanup);
const fakeVideoUrl = 'https://storage.googleapis.com/coverr-main/mp4/Pigeon-Impossible.mp4';
test('GIVEN a chapter title I expect that WHEN the Video component is rendered THEN the correct title is displayed', () => {
  const {
    container
  } = render(React.createElement(MediaPreview, {
    mediaUrl: fakeVideoUrl
  }));
  expect(container.innerHTML).toContain('videoSection');
});
test('GIVEN a video as a chapter with src video url THEN the video is rendered with it\'s source url', () => {
  const {
    getByTestId
  } = render(React.createElement(MediaPreview, {
    mediaUrl: fakeVideoUrl
  }));
  expect(getByTestId('media-player-id').attributes.src.value).toBe(fakeVideoUrl);
});
test('WHEN the Video component is rendered THEN a video element is displayed', () => {
  const wrapper = shallow(React.createElement(MediaPreview, {
    mediaUrl: fakeVideoUrl
  }));
  expect(wrapper.find('video').type()).toBe('video');
});