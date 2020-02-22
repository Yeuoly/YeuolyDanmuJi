import Danmu from './Danmu';
import { SuperChat } from './Danmu';
import store from '../store';

const waiting_time = 1000;
const temp_max_count = 5;
const store_temp_max_count = 2000;

/**
 * 这里说一下，不论是SuperChat还是礼物信息我这里都定义为弹幕
 * 只是给了弹幕多种类型，一种是normal普通类型，一种是superchat，一种是gift
 */

export default class MessageHandler{
    constructor(){
        //启动传输器
        const handler = setInterval(() => {
            this.transDanmu();
        },waiting_time);
    }

    //传输缓存
    temp_danmus = [];
    //入库缓存
    temp_store = [];

    handleMessage(msg){
        let danmu;
        switch(msg['cmd']){
            case 'DANMU_MSG':
                /** $info
                * 0 5 6 7 8 10 11 12 13 14暂时不知道是啥东西 谁能告诉我舰长是哪个？？？
                * 1为弹幕信息 就是一个字符串
                * 2为用户信息 uid-昵称-?-?-?-?-?-?
                * 3为狗牌信息 狗牌等级-狗牌昵称-UP昵称-?-?-?-?
                * 4为用户等级 直播间等级-?-全站排名
                * 9为弹幕设置 ?-?
                * 
                * 我最想知道的是怎么这里为什么不给出舰长信息，还是说我tm得每次自己去取舰长信息
                * 在每次启动的时候去B站拿着个直播间所有的舰长信息，再在创建弹幕对象的时候检测是不是舰长？？？？
                */
                const info = msg['info'];
                danmu = new Danmu(
                    info[2][1],info[2][0],info[1],
                    info[3][0],info[3][1],info[3][2],
                    info[4][0],info[4][3]
                );
                break;
            case 'SEND_GIFT':
                //送礼物的 $data
                /**
                 * face => 用户头像链接
                 * giftId => 礼物ID
                 * giftName => 礼物名
                 * price => 价值，金瓜子银瓜子都算
                 * uid => 用户uid
                 * uname => 用户名
                 * guard_level => 舰队等级 3为舰长 2为提督 1为总督
                 * is_first => 是不是今天第一次送礼物
                 * num => 礼物数量
                 */
                break;
            case 'NOTICE_MSG':
                //这个是全站抽奖广播 $data
                break;
            case 'WELCOME':
                //这个是欢迎老爷
                /**
                 * is_admin => 超管也是老爷，对叭
                 * svip => 年度老爷
                 * vip => 普通老爷
                 * uname => 用户名
                 * uid => 用户uid
                 */
                break;
            case 'WELCOME_GUARD':
                //这个是欢迎舰队 $data
                /**
                 * guard_level => 舰队等级，和上面相同
                 * uid => 用户uid
                 * username => 用户名
                 */
                break;
            case 'ROOM_REAL_TIME_MESSAGE_UPDATE':
                //这个是更新直播间信息的 $data
                /**
                 * fans => 实时粉丝数
                 * roomid => 房间号，不是，房间号还会变的？？？
                 */
            case 'ENTRY_EFFECT':
                //高贵用户的入场特性，我人傻了，特效还专门传的，不想做了，想做的就改这里叭（ $data
                break;
            case 'ROOM_RANK':
                //房间的排名，大概 $data
                /**
                 * color => 这Tm排名都有颜色的嘛？？
                 * rank_desc => 字符串，房间排名信息
                 * timestamp => 时间
                 */
                break;
            case 'SUPER_CHAT_MESSAGE':
                //等了半个小时的SUPERCHAT，真的是Tm参数巨多，而且还很迷惑，看着脑壳痛 $data
                /**
                 * background_bottom_color => sc下面那一块的颜色
                 * background_color => sc下面文字的颜色
                 * background_image => sc的图片，具体忘了是啥，到时候看看叭
                 * background_price_color => 还根据价格定颜色的。。
                 * start_time => 开始时间
                 * end_time => 结束时间
                 * gift => { num => sc算礼物，所以有数量，我喷了, gift_id => sc作为礼物的id , gift_name => 好像永远是醒目留言 }
                 * medal_info => { 
                 *  target_id => ？？？ , 
                 *  anchor_uname => 勋章主名 , 
                 *  anchor_roomid => 勋章主直播间号
                 *  medal_color => 这啥啊
                 *  medal_level => 勋章等级
                 *  medal_name => 勋章名
                 * }
                 * time => 持续时间，不是，有start_time和end_time了还要持续时间干什么？？？
                 * rate => ?????
                 * uid => 用户uid       对没错，说的就是你
                 * message => 主体消息
                 * price => 价格
                 * token => ?????
                 * ts => ????
                 * trans_mark => ???
                 * user_info => {
                 * ************************不是，我tm就很想问，为什么uid不放在user_info里面？？？为什么要单独放在外面？？
                 *  face => 头像链接
                 *  face_frame => 头像框链接
                 *  is_vip => 老爷
                 *  is_svip => 年度老爷
                 *  is_main_vip => ??? 主要老爷？？
                 *  level_color => 等级牌子的颜色
                 *  title => ????superchat还有标题的？？？
                 *  uname => 用户名
                 *  user_level => 直播用户等级
                 * }
                 */
                const data = msg['data'];
                danmu = new SuperChat(
                    data['user_info']['uname'],data['uid'],data['message'],
                    data['medal_info']['medal_level'],data['medal_info']['medal_name'],data['medal_info']['anchor_uname'],
                    data['user_info']['user_level'],data['price'],data['start_time'],data['end_time'],
                    data['background_color'],data['background_bottom_color'],data['background_price_color'],
                    data['background_image'],data['user_info']['face']
                );
                console.log(danmu);
                break;
            case 'SUPER_CHAT_MESSAGE_JPN':
                //说出来你们可能不信，sc还有专门的日文包的，参数和上面基本一致 $data
                /**
                 * 多了一个 message_jpn => 日文翻译草，我寻思这要是其他语种的v多了你要怎么整
                 */
                break;
        }
        //弹幕入库
        /**
         * 由于大量弹幕同时入库会造成大量不必要的性能消耗，这里加上一个弹幕传输限制
         * 每 #waiting_time 传输一次或者缓存弹幕量超过 #temp_max_count时才传输弹幕
         * 同时取消单个弹幕传输的做法，一次性传输一个数组
         */

        //可能存在还没有登记过的消息类型
        if(!danmu)return;

        this.temp_danmus.push(danmu);
        //当弹幕储量达到max_count时传输弹幕
        if(this.temp_danmus.length === temp_max_count){
            this.transDanmu();
        }
        //当弹幕储量达到max_count的时候将弹幕入库
        if(this.temp_store.length === store_temp_max_count){
            //this.dispatchDanmu();
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
            //清理缓存，不清要死人了，内存暴增太可怕了草
            delete this.temp_danmus;
            this.temp_danmus = [];
        }
    }

    //弹幕入库
    dispatchDanmu(){
        if(this.temp_store.length > 0){
            store.dispatch('ADD_DANMUS',this.temp_store);
            delete this.temp_store;
            this.temp_store = [];
        }
    }
}