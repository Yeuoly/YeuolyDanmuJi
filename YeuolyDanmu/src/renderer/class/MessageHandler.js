import Danmu from './Danmu';
import store from '../store';

const waiting_time = 1000;
const temp_max_count = 5;
const store_temp_max_count = 200;

export default class MessageHandler{
    constructor(){
        //启动传输器
        const handler = setInterval(() => {
            this.transDanmu();
        },waiting_time);
    }

    handleMessage(msg){
        switch(msg['cmd']){
            case 'DANMU_MSG':
                this.handleDanmu(msg['info']);
        }
    }

    //传输缓存
    temp_danmus = [];
    //入库缓存
    temp_store = [];

    handleDanmu(danmu_msg){
        /**
         * 0 5 6 7 8 10 11 12 13 14暂时不知道是啥东西 谁能告诉我舰长是哪个？？？
         * 1为弹幕信息 就是一个字符串
         * 2为用户信息 uid-昵称-?-?-?-?-?-?
         * 3为狗牌信息 狗牌等级-狗牌昵称-UP昵称-?-?-?-?
         * 4为用户等级 直播间等级-?-全站排名
         * 9为弹幕设置 ?-?
         */
        const danmu = new Danmu(
            danmu_msg[2][1],danmu_msg[2][0],danmu_msg[1],
            danmu_msg[3][0],danmu_msg[3][1],danmu_msg[3][2],
            danmu_msg[4][0],danmu_msg[4][3]
        );
        //弹幕入库
        /**
         * 由于大量弹幕同时入库会造成大量不必要的性能消耗，这里加上一个弹幕传输限制
         * 每 #waiting_time 传输一次或者缓存弹幕量超过 #temp_max_count时才传输弹幕
         * 同时取消单个弹幕传输的做法，一次性传输一个数组
         */

        this.temp_danmus.push(danmu);
        //当弹幕储量达到max_count时传输弹幕
        if(this.temp_danmus.length === temp_max_count){
            this.transDanmu();
        }
        //当弹幕储量达到max_count的时候将弹幕入库
        if(this.temp_store.length === store_temp_max_count){
            this.dispatchDanmu();
        }
    }

    //传输弹幕
    transDanmu(){
        if(this.temp_danmus.length > 0){
            //dispatch巨tm消耗性能，考虑满一定大的量再入库
            //store.dispatch('ADD_DANMUS',this.temp_danmus);
            if(typeof this.onAdd === 'function'){
                this.onAdd(this.temp_danmus);
            }
            this.temp_danmus = [];
        }
    }

    //弹幕入库
    dispatchDanmu(){
        if(this.temp_store.length > 0){
            store.dispatch('ADD_DANMUS',this.temp_store);
            this.temp_store = [];
        }
    }
}