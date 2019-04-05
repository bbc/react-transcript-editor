/**
* Raised in this comment https://github.com/bbc/react-transcript-editor/pull/9
* abstracted from https://github.com/bbc/newslabs-cdn/blob/master/js/20-bbcnpf.utils.js
* In broadcast VIDEO, timecode is NOT hh:mm:ss:ms, it's hh:mm:ss:ff where ff is frames,
* dependent on the framerate of the media concerned.
* `hh:mm:ss:ff`
*/

/**
 * Helper function
 * Rounds to the 14milliseconds boundaries
 * Time in video can only "exist in" 14milliseconds boundaries.
 * This makes it possible for the HTML5 player to be frame accurate.
 * @param {*} seconds
 * @param {*} fps
 */
const normalisePlayerTime = function (seconds, fps) {
  return Number((1.0 / fps * Math.floor(Number((fps * seconds).toPrecision(12)))).toFixed(2));
};

/*
* @param {*} seconds
* @param {*} fps
*/
const secondsToTimecode = function (seconds, framePerSeconds) {
  // written for PAL non-drop timecode
  let fps = 25;
  if (framePerSeconds !== undefined) {
    fps = framePerSeconds;
  }

  const normalisedSeconds = normalisePlayerTime(seconds, fps);

  const wholeSeconds = Math.floor(normalisedSeconds);
  const frames = ((normalisedSeconds - wholeSeconds) * fps).toFixed(2);

  // prepends zero - example pads 3 to 03
  function _padZero(n) {
    if (n < 10) return `0${ parseInt(n) }`;

    return parseInt(n);
  }

  return `${ _padZero((wholeSeconds / 60 / 60) % 60)
  }:${
    _padZero((wholeSeconds / 60) % 60)
  }:${
    _padZero(wholeSeconds % 60)
  }:${
    _padZero(frames) }`;
};

export default secondsToTimecode;
