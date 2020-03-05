const daily_log_records = [];

const daily_gift_records = [];

const daily_sc_records = [];

export default {
    getDailyGiftRecords(){
        return daily_gift_records.slice(0);
    },
    getDailyLogRecords(){
        return daily_log_records.slice(0);
    },
    getDailySCRecords(){
        return daily_sc_records.slice(0);
    },
    getDailyLogRecordsPointer(){
        return daily_log_records;
    },
    getDailyGiftRecordsPointer(){
        return daily_gift_records;
    },
    getDailySCRecordsPointer(){
        return daily_sc_records;
    },
    addLog(log){
        if(typeof log === 'object'){
            log.forEach( e => {
                daily_log_records.push(e);
            });
        }else{
            daily_log_records.push(log);
        }
    },
    addGift(gf){
        if(typeof gf === 'object'){
            gf.forEach( e => {
                daily_gift_records.push(e);
            });
        }else{
            daily_gift_records.push(gf);
        }
    },
    addSC(sc){
        if(typeof sc === 'object'){
            sc.forEach( e => {
                daily_gift_records.push(e);
            });
        }else{
            daily_gift_records.push(sc);
        }
    }
}