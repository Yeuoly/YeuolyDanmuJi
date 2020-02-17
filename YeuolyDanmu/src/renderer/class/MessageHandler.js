import Danmu from './Danmu';
import store from '../store';

export default class MessageHandler{
    handleMessage(msg){
        switch(msg['cmd']){
            case 'DANMU_MSG':
                this.handleDanmu(msg['info']);
        }
    }

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
        store.dispatch('ADD_DANMU',danmu);
    }
}