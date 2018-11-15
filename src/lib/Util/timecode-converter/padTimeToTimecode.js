const countColon = (timecode)=>{
    return timecode.split(':').length;
}

const includesFullStop = (timecode)=>{
   return timecode.includes('.');
}

const isOneDigit = (str) => {
 return str.length === 1;
}

const padTimeToTimecode = (time) =>{
    if(typeof time === 'string'){
        switch(countColon(time)) {
            case 4:
                // is already in timecode format
                // hh:mm:ss:ff
                return time;
            case 2:
                // m:ss
                if(isOneDigit(time.split(':')[ 0 ])){
                    return `00:0${ time }:00`;
                } 
                // mm:ss
                return `00:${ time }:00`;
            case 3:
                // hh:mm:ss
                return `${ time }:00`;
            default:
                // mm.ss
                if(includesFullStop(time)){
                    // m.ss
                    if(isOneDigit(time.split('.')[ 0 ])){
                        return `00:0${ time.split('.')[ 0 ] }:${ time.split('.')[ 1 ] }:00`;
                    } 
                    // mm.ss
                    return `00:${ time.replace('.',':') }:00`;
                }
                else{
                    // if just int, then it's seconds
                    // s
                    if(isOneDigit(time)){
                        return `00:00:0${ time }:00`;
                    }
                    // ss
                    return `00:00:${ time }:00`;
                }
        } 
    // edge case if it's number return a number coz cannot refactor
    // TODO: might need to refactor and move this elsewhere 
    }else{
        return time;
    }
}

export default padTimeToTimecode;