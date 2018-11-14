/**
 * Wrapping around 
 * https://www.npmjs.com/package/node-timecodes 
 * To provide more support for variety of formats.
 */
// import timecodes from 'node-timecodes';
import secondsToTimecode  from './secondsToTimecode.js';
import timecodeToSecondsHelper  from './timecodeToSeconds.js';

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
    let newCurrentTimeInSeconds = time;
    if(typeof newCurrentTimeInSeconds !== 'number'){
        if( newCurrentTimeInSeconds.includes(':')){
          // hh:mm:ss:ms --> already in right format
          if(newCurrentTimeInSeconds.split(':').length === 4){
            newCurrentTimeInSeconds = timecodeToSecondsHelper(newCurrentTimeInSeconds);
          }
           // mm:ss --> convert to hh:mm:ss:ms
          else if(newCurrentTimeInSeconds.split(':').length === 2){
            // if it's m:ss
           if(newCurrentTimeInSeconds.split(':')[ 0 ].length ===1){
            newCurrentTimeInSeconds = `0${ newCurrentTimeInSeconds.split(':')[ 0 ] }:${ newCurrentTimeInSeconds.split(':')[ 1 ] }`;
            } 

            newCurrentTimeInSeconds = `00:${ newCurrentTimeInSeconds }:00`;
            newCurrentTimeInSeconds = timecodeToSecondsHelper(newCurrentTimeInSeconds);
          }
          //  hh:mm:ss
          else if(newCurrentTimeInSeconds.split(':').length === 3){
            newCurrentTimeInSeconds = `${ newCurrentTimeInSeconds }:00`;
            newCurrentTimeInSeconds = timecodeToSecondsHelper(newCurrentTimeInSeconds);
            }
        }
        // doesn't include : and includes . instead mm.ss
        else if( newCurrentTimeInSeconds.includes('.')){
            if(newCurrentTimeInSeconds.split('.')[ 0 ].length ===1){
                newCurrentTimeInSeconds = `0${ newCurrentTimeInSeconds.split('.')[ 0 ] }:${ newCurrentTimeInSeconds.split('.')[ 1 ] }`;
                } 
                newCurrentTimeInSeconds = `00:${ newCurrentTimeInSeconds.replace('.',':') }:00`;
                newCurrentTimeInSeconds = timecodeToSecondsHelper(newCurrentTimeInSeconds);
        }
        // assuming it receive timecode as seconds as string '600'
        else {
            return parseFloat(newCurrentTimeInSeconds)
         }
      }

    return newCurrentTimeInSeconds;
}

export { secondsToTimecode, timecodeToSeconds }
