import { OrdinaryEventBus } from '../events/evnetBus';
import actions from './records';
import Utils from '../class/Utils';

const danmu_speed_cache = {
    accumulate_time : 0,
    accumulate_count : 0
};

const speed_calc_interval = 30000;

//挂载速度事件
OrdinaryEventBus.$on('current-speed', v => {
    //我知道这里代码可读性跟屎一样，反正只要知道这是个算平均速度的就行了
    danmu_speed_cache.accumulate_time += v.time;
    danmu_speed_cache.accumulate_count += v.count;
    if(danmu_speed_cache.accumulate_time > speed_calc_interval){
        const V = ( danmu_speed_cache.accumulate_count * 1000 ) / danmu_speed_cache.accumulate_time;
        const D = Utils.formatDate(new Date(),'hh:mm:ss');
        actions.setters.speed(V,D);
        danmu_speed_cache.accumulate_count = 0;
        danmu_speed_cache.accumulate_time = 0;
    }
});

export const getDailyGiftRecords = () => actions.getters.clonner.gift();

export const getDailyLogRecords = () => actions.getters.clonner.log();

export const getDailySCRecords = () => actions.getters.clonner.sc();

export const getInteractionalDDs = () => actions.getters.clonner.idd();

export const getPaiedDDs = () => actions.getters.clonner.pdd();

export const getDailyLogRecordsPointer = () => actions.getters.pointer.log();

export const getDailyGiftRecordsPointer = () => actions.getters.pointer.gift();

export const getDailySCRecordsPointer = () => actions.getters.pointer.sc();

export const getDailyGuardRecordsPointer = () => actions.getters.pointer.guard();

export const addDanmus = danmus => actions.setters.danmus(danmus);

export const addLog = (text, color, type) => actions.setters.log(text, color, type);

export const addGift = gf => actions.setters.gift(gf);

export const addSC = sc => actions.setters.superchat(sc);

export const addGuard = guard => actions.setters.guard(guard);

export const getStatisticPointer = () =>  actions.getters.pointer.statistics();

export const clearStatistic = () => actions.extrs.clearStatistics();

export const writeRecords = () => actions.extrs.saveRecords();

/**
 * @param {string} channel 将该监听器绑定至的频道，现有频道："danmu" "gift" "sc" "guard" 
 * @param {function(msg)} messager 监听器，将会把消息传入其中
 */
export const setListenner = (channel, messager) => actions.extrs.setListenner(channel, messager);

/**
 * @param {string} channel 指定的监听频道
 * @param {function(msg)} messager 监听器，将会移除该监听器
 */
export const removeListenner = (channel, messager) => actions.extrs.removeListenner(channel,messager);