const daily_log_records = [];

const daily_gift_records = [];

const daily_sc_records = [];

export function getDailyGiftRecords(){
    return daily_gift_records.slice(0);
}
export function getDailyLogRecords(){
    return daily_log_records.slice(0);
}
export function getDailySCRecords(){
    return daily_sc_records.slice(0);
}
export function getDailyLogRecordsPointer(){
    return daily_log_records;
}
export function getDailyGiftRecordsPointer(){
    return daily_gift_records;
}
export function getDailySCRecordsPointer(){
    return daily_sc_records;
}
export function addLog(log){
    if(typeof log === 'object'){
        log.forEach( e => {
            daily_log_records.push(e);
        });
    }else{
        daily_log_records.push(log);
    }
}
export function addGift(gf){
        // if(typeof gf === 'object'){
        //     gf.forEach( e => {
        //         daily_gift_records.push(e);
        //     });
        // }else{
    daily_gift_records.push(gf);
        // }
}
export function addSC(sc){
        // if(typeof sc === 'object'){
        //     sc.forEach( e => {
        //         daily_gift_records.push(e);
        //     });
        // }else{
    daily_sc_records.push(sc);
        // }
}