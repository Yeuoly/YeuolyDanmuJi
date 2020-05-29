import { OrdinaryEventBus } from '../events/evnetBus';
import actions from './records';
import Utils from '../modules/Utils';

//挂载速度事件
OrdinaryEventBus.$on('current-popular', v => actions.setters.speed(v,Utils.formatDate(new Date(),'hh:mm:ss')));

export const getDailyGiftRecords = () => actions.getters.clonner.gift();

export const getDailyLogRecords = () => actions.getters.clonner.log();

export const getDailySCRecords = () => actions.getters.clonner.sc();

export const getDailyDanmuRecords = () => actions.getters.clonner.danmu();

export const getInteractionalDDs = () => actions.getters.clonner.idd();

export const getPaiedDDs = () => actions.getters.clonner.pdd();

export const getDailyDanmuPointer = () => actions.getters.pointer.danmu();

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