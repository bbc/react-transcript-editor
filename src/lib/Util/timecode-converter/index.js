/**
 * Wrapping around 
 * https://www.npmjs.com/package/node-timecodes 
 * To provide more support for variety of formats.
 */
// import timecodes from 'node-timecodes';
import secondsToTimecode  from './secondsToTimecode.js';
import timecodeToSecondsHelper  from './timecodeToSeconds.js';
import padTimeToTimecode from './padTimeToTimecode.js';
// const secondsToTimecode = (time)=>{
//     if(typeof newCurrentTimeInSeconds !== 'number'){
//         return timecodes.fromSeconds(parseFloat(time))
//     }
//     return timecodes.fromSeconds(time)   
// }

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
const timecodeToSeconds = (time)=>{
    if(typeof time === 'string'){
      const resultPadded = padTimeToTimecode(time);
      const resultConverted = timecodeToSecondsHelper(resultPadded);
      return resultConverted;
        // assuming it receive timecode as seconds as string '600'
    } else {
      return  parseFloat(time);
    }
}

export { secondsToTimecode, timecodeToSeconds }
