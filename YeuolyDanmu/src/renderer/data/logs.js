import { global_settings } from '../settings/global_settings';
import Utils from '../class/Utils';
//落魄到用日志文件来代替原本的礼物SC记录
const log = require('electron-log');
log.transports.console.level = false;
/**
 * 写着一段的时候我自己都很懵，大概思路，每次保存日志文件都是保存在下面这个鬼文件里，文件名为启动时间
 * 每次写入记录都是 【时间】+【类别】+【文本】这样的格式
 * 每次写入只写入新增记录，具体实现看底下叭，就算写的时候很懵很乱，这点逻辑应该还是很容易看懂的
 */
log.transports.file.file =  `${global_settings['log_module']['sc_path']}records\\${Utils.formatDate(new Date(),'yyyy-MM-dd-hh')}.txt`;
log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";

console.log(log.transports.file.file);

const daily_log_records = [];

const daily_gift_records = [];

const daily_sc_records = [];

const daily_danmu_records = [];

let last_index_sc = 0;
let last_index_gift = 0;
let last_index_danmu = 0;

export function writeRecords(){
    if(last_index_sc !== daily_sc_records.length)
        log.log(JSON.stringify(daily_sc_records.slice(last_index_sc)));
    if(last_index_gift !== daily_gift_records.length)
        log.log(JSON.stringify(daily_gift_records.slice(last_index_gift)));
    if(last_index_danmu !== daily_danmu_records.length)
        log.log(JSON.stringify(daily_danmu_records.slice(last_index_danmu)));
    last_index_gift = daily_gift_records.length;
    last_index_sc = daily_sc_records.length;
    last_index_danmu = daily_danmu_records.length;
}

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
export function addDanmus(danmus){
    danmus.forEach( e => {
        daily_danmu_records.push({ uid:e.user.uid, id:e.user.id, message:e.message });
    });
}
export function addLog(log){
    daily_log_records.push(log);
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