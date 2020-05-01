import log from './records_init';

import statistics from './states/statistic';
import records from './states/records';
import plugins from './states/plugins';
import logger from './states/logger';

//更新互动DD
const updateInteractionalDD = ( id, uid ) => {
    if(records.interactional_dd_hash.operate(uid).insert({
        uid : uid,
        id : id,
        times : 1
    })){
        statistics.interactional_dd_count++;
    }else{
        records.interactional_dd_hash.operate().change( item => {
            item['times']++;
        });
    }
};

//更新打钱DD
const updatePaiedDD = ( id, uid, price ) => {
    if(records.paied_dd_hash.operateByNumber(uid).insert({
        uid : uid,
        id : id,
        price : price
    })){
        statistics.paied_dd_count++;
    }else{
        records.paied_dd_hash.operate().change( item => {
            item['price'] += price;
        });
    }
};

//
const getChannel = channel => {
    switch(channel){
        case 'danmu':
            return plugins.channel_listenners[0];
        case 'gift':
            return plugins.channel_listenners[2];
        case 'sc':
            return plugins.channel_listenners[3];
        case 'guard':
            return plugins.channel_listenners[4];
    }
    return null;
}

const actions = {
    getters : {
        clonner : {
            gift(){ return records.daily_gift_records.slice(0); },
            log(){ return records.daily_log_records.slice(0); },
            sc(){ return records.daily_sc_records.slice(0); },
            guard(){ return records.daily_guard_records.slice(0); },
            idd(){ return records.interactional_dd_hash.clone(); },
            pdd(){ return records.paied_dd_hash.clone(); },
            danmu(){ return records.daily_danmu_records.slice(0); }
        },
        pointer : {
            gift(){ return records.daily_gift_records; },
            log(){ return records.daily_log_records; },
            sc(){ return records.daily_sc_records; },
            guard(){ return records.daily_guard_records; },
            statistics(){ return statistics; },
            danmu(){ return records.daily_danmu_records; }
        }
    },
    setters : {
        danmus(items){
            items.forEach( e => {
                statistics.danmu_count++;
                //更新互动
                updateInteractionalDD(e.user.id,e.user.uid);
                records.daily_danmu_records.push({ uid:e.user.uid, id:e.user.id, message:e.message });
                //开始监听咯
                plugins.channel_listenners[0].forEach( event => { event(e); } );
            });
        },
        log(text,color,type){
            const log = { 
                class_name : color, 
                log : text, 
                type : type, 
                line_id : records.daily_log_records.length 
            };
            records.daily_log_records.push(log);
            plugins.channel_listenners[1].forEach( event => { event(log); } );
        },
        gift(gf){
            //更新互动
            updateInteractionalDD(gf.user.id, gf.user.uid);
            //如果不是辣条那就是打了钱，然后就检测是否打过钱
            if(gf.gift_id !== 1){
                //更新打钱
                updatePaiedDD(gf.user.id, gf.user.uid, gf.gift_price);
                statistics.au_price += gf.gift_price;
            }else{
                statistics.ag_price += gf.gift_price;
            }
            statistics.total_price += gf.gift_price;
            records.daily_gift_records.push(gf);
            plugins.channel_listenners[2].forEach( event => { event(gf); } );
        },
        superchat(sc){
            //更新打钱
            updatePaiedDD(sc.user.id,sc.user.uid,sc.price * 1000);
            //更新互动
            updateInteractionalDD(sc.user.id,sc.user.uid);
            statistics.total_sc_price += sc.price;
            records.daily_sc_records.push(sc);
            plugins.channel_listenners[3].forEach( event => { event(sc); } );
        },
        guard(gd){
            //更新打钱
            updatePaiedDD(gd.user.id, gd.user.uid, gd.price);
            //更新互动
            updateInteractionalDD(gd.user.id, gd.user.uid);
            statistics.total_guard_price += gd.price;
            statistics.total_guard_count++;
            records.daily_guard_records.push(gd);
            plugins.channel_listenners[4].forEach( event => { event(gd); } );
        },
        speed(v,d){
            statistics.danmu_speeds.value.push(v);
            statistics.danmu_speeds.date.push(d);
        }
    },
    extrs : {
        clearStatistics(){
            for(let i in statistics){
                if(typeof statistics[i] === 'number'){
                    statistics[i] = 0;
                }
            }
            records.paied_dd_hash.clear();
            records.interactional_dd_hash.clear();
            statistics.danmu_speeds = { value : [], date: [] };
            records.daily_danmu_records = [];
            records.daily_gift_records = [];
            records.daily_log_records = [];
            records.daily_sc_records = [];
            records.daily_guard_records = [];
        },
        saveRecords(){
            //写日志
            if(logger.last_index_sc !== records.daily_sc_records.length)
                log.log(
                    JSON.stringify(
                        records.daily_sc_records.slice(logger.last_index_sc).map( v => ({
                            date : v.start_time,
                            price : v.price,
                            message : v.message,
                            user : v.user
                        }))
                    )
                );
            if(logger.last_index_gift !== records.daily_gift_records.length)
                log.log(
                    JSON.stringify(
                        records.daily_gift_records.slice(logger.last_index_gift).map( v => ({
                            gift_name : v.gift_name,
                            gift_price : v.gift_price,
                            gift_num : v.gift_num,
                            user : v.user
                        }))
                    )
                );
            if(logger.last_index_danmu !== records.daily_danmu_records.length)
                log.log(
                    JSON.stringify(
                        records.daily_danmu_records.slice(logger.last_index_danmu)
                    )
                );
            if(logger.last_index_guard !== records.daily_guard_records.length)
                log.log(
                    JSON.stringify(
                        records.daily_guard_records.slice(logger.last_index_guard).map( v => ({
                            guard_type : v.guard_type,
                            price : v.price,
                            user : v.user
                        }))
                    )
                )
            logger.last_index_gift = records.daily_gift_records.length;
            logger.last_index_sc = records.daily_sc_records.length;
            logger.last_index_danmu = records.daily_danmu_records.length;
        },
        setListenner(channel, messager){
            const c = getChannel(channel);
            c && c.push(messager);
        },
        removeListenner(channel, messager){
            const c = getChannel(channel);
            if(!c)return;
            for(let i in c){
                if(c[i] === messager){
                    c.splice(i,1);
                    return;
                }
            }
        }
    },
}

export default actions;