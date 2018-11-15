const padTimeToTimecode = (time) =>{
    const newCurrentTimeInSeconds = time;
    if(typeof time === 'string'){
        if( newCurrentTimeInSeconds.includes(':')){
            // hh:mm:ss:ms --> already in right format
            if(newCurrentTimeInSeconds.split(':').length === 4){
            return newCurrentTimeInSeconds;
            }
            // mm:ss --> convert to hh:mm:ss:ms
            else if(newCurrentTimeInSeconds.split(':').length === 2){
            // if it's m:ss
                if(newCurrentTimeInSeconds.split(':')[ 0 ].length ===1){
                return `00:0${ newCurrentTimeInSeconds }:00`;
                } 
            return `00:${ newCurrentTimeInSeconds }:00`;
            }
            //  hh:mm:ss
            else if(newCurrentTimeInSeconds.split(':').length === 3){
            return `${ newCurrentTimeInSeconds }:00`;
            }
        }
        // doesn't include : and includes . instead mm.ss
        else if( newCurrentTimeInSeconds.includes('.')){
            if(newCurrentTimeInSeconds.split('.')[ 0 ].length ===1){
                return `00:0${ newCurrentTimeInSeconds.split('.')[ 0 ] }:${ newCurrentTimeInSeconds.split('.')[ 1 ] }:00`;
                } 
                return `00:${ newCurrentTimeInSeconds.replace('.',':') }:00`;
                
        }else{
            // if just int, then it's seconds
            return `00:00:${ time }:00`;
        }
    // edge case if it's number return a number coz cannot refactor
    // TODO: might need to refactor and move this elsewhere 
    }else{
        return time;
    }
}

export default padTimeToTimecode;