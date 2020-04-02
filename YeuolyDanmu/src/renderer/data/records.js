import HashList from '../class/HashList';
import Utils from '../class/Utils';
import './records_init';
import log from 'electron-log';

const statistics = {
    total_price : 0,
    au_price : 0,
    ag_price : 0,
    danmu_count : 0,
    interactional_dd_count : 0,
    paied_dd_count : 0,
    total_sc_price : 0,
    total_guard_price : 0,
    total_guard_count : 0,
    danmu_speeds : {  
        value : [ 0 ],
        date : [ Utils.formatDate(new Date(),'hh:mm:ss') ]
    },
    //这个是为后续统计做的，但考虑到现在的CPU已经挺蛋疼了，就暂时不做了
    gift_classfiy_count : []
};

const records = {
    daily_log_records : [{
        class_name : 'grey',
        log : '[LogConsole]:日志模块已启动',
        type : 'info',
        line_id : 0
    },{
        class_name : 'grey',
        log : '[Greet]大佬好，我是这个弹幕姬的作者Yeuoly，这个破弹幕姬基于Electron+Vue+ElementUI开发，' +
            '希望您能用着舒服。如果大佬们想参加发开的话我留个链接放这里orz https://github.com/Yeuoly/YeuolyDanmuJI',
        type : 'info',
        line_id : 1
    },{
        class_name : 'grey',
        log : '[Contact]顺便再放一个联系方式：QQ2035914926',
        type : 'info',
        line_id : 2
    }],
    daily_gift_records : [],
    daily_sc_records : [],
    daily_danmu_records : [],
    daily_guard_records : [],
    //好了，开始处理hash，参加互动的dd数量级应该是10^3-10^4，用两层表够了，打钱的dd应该在10^2左右，一层表就行了
    interactional_dd_hash : new HashList(2),
    paied_dd_hash : new HashList(1),
};

const plugins = {
    /**
     * 管道监听器，emmm说清楚点就是，如果有点发了弹幕，那就会调用监听器，将弹幕传输给监听程序
     */
    channel_listenners : [[],[],[],[],[]],
};

const logger = {
    last_index_sc : 0,
    last_index_gift : 0,
    last_index_danmu : 0,
};

const states = {
    statistics,
    records,
    plugins,
    logger
};

//更新互动DD
const updateInteractionalDD = ( id, uid ) => {
    if(records.interactional_dd_hash.operate(uid).insert({
        uid : uid,
        id : id,
        times : 1
    }).result){
        statistics.interactional_dd_count++;
    }else{
        records.interactional_dd_hash.opter.change( item => {
            item['times']++;
        });
    }
};

//更新打钱DD
const updatePaiedDD = ( id, uid, price ) => {
    if(records.paied_dd_hash.operate(uid).insert({
        uid : uid,
        id : id,
        price : price
    }).result){
        statistics.paied_dd_count++;
    }else{
        records.paied_dd_hash.opter.change( item => {
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
            idd(){ return records.interactional_dd_hash.opter.clone().result; },
            pdd(){ return records.paied_dd_hash.opter.clone().result; }
        },
        pointer : {
            gift(){ return records.daily_gift_records; },
            log(){ return records.daily_log_records; },
            sc(){ return records.daily_sc_records; },
            guard(){ return records.daily_guard_records; },
            statistics(){ return statistics; }
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
            //只要知道是在写日志就行了
            if(logger.last_index_sc !== records.daily_sc_records.length)
                log.log(
                    JSON.stringify(
                        records.daily_sc_records.slice(logger.last_index_sc)
                    )
                );
            if(logger.last_index_gift !== records.daily_gift_records.length)
                log.log(
                    JSON.stringify(
                        records.daily_gift_records.slice(last_index_gift)
                    )
                );
            if(logger.last_index_danmu !== records.daily_danmu_records.length)
                log.log(
                    JSON.stringify(
                        records.daily_danmu_records.slice(last_index_danmu)
                    )
                );
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