/**
* Raised in this comment https://github.com/bbc/react-transcript-editor/pull/9
* abstracted from https://github.com/bbc/newslabs-cdn/blob/master/js/20-bbcnpf.utils.js
* In broadcast VIDEO, timecode is NOT hh:mm:ss:ms, it's hh:mm:ss:ff where ff is frames, 
* dependent on the framerate of the media concerned.
*/
// `hh:mm:ss:ff` 

/**
 * Helper funciton 
 * @param {*} seconds 
 * @param {*} fps 
 */
const normalisePlayerTime = function(seconds, fps){
    return Number((1.0/fps*Math.floor(Number((fps*seconds).toPrecision(12)))).toFixed(2))
}

/*
* @param {*} seconds 
 * @param {*} fps 
 */
const seconds2timecode = function(seconds, framePerSeconds) {
    // written for PAL non-drop timecode
    let fps = 25;
    if (framePerSeconds !== undefined){
        fps = framePerSeconds;
    }

    const ns= normalisePlayerTime(seconds, fps);
    
    const wsec=Math.floor(ns)
    const frames=((ns-wsec)*fps).toFixed(2)

    function _n2(n){
        if(n<10)return '0'+parseInt(n)
        else return parseInt(n)
    }

    return _n2((wsec/60/60)%60)
        + ':'
        + _n2((wsec/60)%60)
        + ':'
        + _n2(wsec%60)
        + ':'
        + _n2(frames)
}

export default seconds2timecode;