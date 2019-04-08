/**
 * Wrapping around "time stamps" and timecode conversion modules
 * To provide more support for variety of formats.
 */
import secondsToTimecode from './src/secondsToTimecode';
import timecodeToSecondsHelper from './src/timecodeToSeconds';
import padTimeToTimecode from './src/padTimeToTimecode';

/**
 * @param {*} time
 * Can take as input timecodes in the following formats
 * - hh:mm:ss:ff
 * - mm:ss
 * - m:ss
 * - ss - seconds --> if it's already in seconds then it just returns seconds
 * - hh:mm:ff
 * @todo could be refactored with some helper functions for clarity
 */
const timecodeToSeconds = (time) => {
  if (typeof time === 'string') {
    const resultPadded = padTimeToTimecode(time);
    const resultConverted = timecodeToSecondsHelper(resultPadded);

    return resultConverted;
  }

  // assuming it receive timecode as seconds as string '600'
  return parseFloat(time);
};

const shortTimecode = (time) => {
  const timecode = secondsToTimecode(time);

  return timecode.slice(0, -3);
};

export { secondsToTimecode, timecodeToSeconds, shortTimecode };
