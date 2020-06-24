import Utils from '../modules/Utils';
import GiftStation from '../modules/GiftStation';
import { SuperChat , Gift , Guard, Danmu } from './Danmu';
import { OrdinaryEventBus } from '../events/evnetBus';
import { global_settings } from '../settings/global_settings';

const temp_max_count = Utils.varToPointer( () => global_settings['loading_module']['danmu_temp_max_count'] );

//礼物自动过滤开关
let auto_filt_low_price = Utils.varToPointer( () => global_settings['loading_module']['auto_filt_low_gift'] );
//最低的直接显示礼物价值，如果一个礼物的价值高于$direct_gift_trans_min_price，就可以直接显示，否则要丢到礼物处理站处理一下
let direct_gift_trans_min_price = Utils.varToPointer( () => global_settings['loading_module']['direct_trans_gift_min_line'] );

/**
 * 这里再说一下，经过弹幕爆破测试，非常有必要根据弹幕速度设置缓存量
 * 
 */

const speed_list_time = global_settings['loading_module']['speed_list_info'];

export default class MessageHandler{
    constructor(){
        //传输缓存
        this.temp_danmus = [];
        //速度相关
        this.speed_info = { waiting_time : 1000 , latiao_min : 2 , price_min : 100 };

        //速度计算参数
        this.danmu_count = {
            last : 0,
            now : 0,
        }
        //初始化礼物处理站
        const self = this;
        GiftStation.setSender( res => {
            /**
             * 根据速度判断是否打开礼物过滤
             * 简称礼物自动过滤
             * 大胆猜想，不过都不用猜了，基本可以认定  礼物速度正比于弹幕速度，
             * 比如说，高速状态下 SPEED>=8 ，如果礼物是辣条，要送了100根以上的辣条才会显示，否则就过滤掉
             * 如果礼物不是辣条，那就得总价值超过10000金瓜子才会显示，否则过滤掉
             */
            if(auto_filt_low_price){
                if(res.gift_id === 1 && res.gift_num < self.speed_info.latiao_min){
                    return;
                }else if(res.gift_id !== 1 && res.gift_price < self.speed_info.price_min){
                    return;
                }
            }
            
            this.transGift(res);
        });
        this.setupLoop();
    }

    //计算速度
    speedCalc(){
        const dif = this.danmu_count.now - this.danmu_count.last;
        const speed = (dif / this.speed_info.waiting_time) * 1000;
        for(let i in speed_list_time){
            if( speed >= speed_list_time[i].SPEED ){
                this.speed_info = {
                    waiting_time : speed_list_time[i].INTERVAL,
                    latiao_min : speed_list_time[i].LATIAO_MIN,
                    price_min : speed_list_time[i].RPICE_MIN
                };
                break;
            }
        }
        this.danmu_count.now = this.danmu_count.last;
    }

    setupLoop(){
         //消息循环
        const looper = () => {
            //传输弹幕出去
            this.transDanmu();
            setTimeout(() => {
                looper();
                this.speedCalc();
            },this.speed_info.waiting_time);
        }
        looper();
    }

    //装载弹幕进入类内
    async handleMessage(msg){
        let danmu;
        switch(msg['cmd']){
            case 'DANMU_MSG':
                /** $info
                * 0 5 6 8 10 11 12 13 14暂时不知道是啥玩意
                * 1为弹幕信息 就是一个字符串
                * 2为用户信息 uid-昵称-?-?-?-?-?-?
                * 3为狗牌信息 狗牌等级-狗牌昵称-UP昵称-?-?-?-?
                * 4为用户等级 直播间等级-?-全站排名
                * 7舰队等级，这个我找得好累啊 1是总督 2是提督 3是舰长
                * 9为弹幕设置 ?-?
                */
                const info = msg['info'];
                danmu = await Danmu(
                    info[2][1],info[2][0],null,info[1],
                    info[3][0],info[3][1],info[3][2],
                    info[4][0],info[4][3],info[7]
                );
                //增加弹幕数量
                this.danmu_count.now++;

                //加入临时缓存
                this.temp_danmus.push(danmu);
                //当弹幕储量达到max_count时传输弹幕
                if(this.temp_danmus.length === temp_max_count){
                    this.transDanmu();
                }
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
                const gf = msg['data'];
                /** 
                 * 这里有个很蛋疼的事情，有一堆用户都是一根辣条一根辣条地送，这样造成了严重的性能损耗
                 * 但也不能无视人家送的礼物叭？？总还是要礼貌性地接收一下，总价值超过一定值之后再传入礼物列表
                 * 这样可以有效地过滤掉
                 * 为了解决这个玩意，我决定加一个低价值礼物缓存，只缓存辣条，缓存模式参照头像链接缓存，hash分表
                 * */ 
                //有一些价值为0的礼物，还没想好怎么处理，就先这里掐掉
                if(gf['price'] === 0){
                    return;
                }
                danmu = await Gift(
                    gf['uname'],gf['uid'],gf['face'],gf['giftId'],gf['giftName'],
                    gf['price'],gf['num'],false
                );
                if(gf['giftId'] === 1 || gf['price'] < direct_gift_trans_min_price ){
                    //如果是辣条或者价值低的话就丢到处理站里去，由处理站转交Task，如果不是就直接传给Task处理
                    GiftStation.insertGift(gf['uid'],gf['num'],gf['giftId'],danmu);
                    return;
                }
                this.transGift(danmu);
                break;
            case 'NOTICE_MSG':
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
                const wg = msg['data'];
                const gi = GiftStation.getGuardInfo(wg['guard_level']);
                danmu = await Danmu(wg['username'],wg['uid'],`${gi['name']}进入了直播间`,0,0,0,0,0,wg['guard_level']);
                //增加弹幕数量
                this.danmu_count.now++;

                //加入临时缓存
                this.temp_danmus.push(danmu);
                //当弹幕储量达到max_count时传输弹幕
                if(this.temp_danmus.length === temp_max_count){
                    this.transDanmu();
                }
                break;
            case 'ROOM_REAL_TIME_MESSAGE_UPDATE':
                //这个是更新直播间信息的 $data
                /**
                 * fans => 实时粉丝数
                 * roomid => 房间号，不是，房间号还会变的？？？
                 */
                this.transLiveInfo({ fans : msg['data']['fans'] });
                return;
            case 'YEUOLY_CUREENT_POPULAR':
                this.transLiveInfo({ popular : msg['data']['popular']});
                OrdinaryEventBus.$emit('current-popular', msg['data']['popular']);
                return;
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
                danmu = await SuperChat(
                    data['user_info']['uname'],data['uid'],data['message'],
                    data['medal_info'] ? data['medal_info']['medal_level'] : 0,
                    data['medal_info'] ? data['medal_info']['medal_name'] : '',
                    data['medal_info'] ? data['medal_info']['anchor_uname'] : 0,
                    data['user_info']['user_level'],data['price'],data['start_time'],data['end_time'],
                    data['background_color'],data['background_bottom_color'],data['background_price_color'],
                    data['background_image'],data['user_info']['face']
                );
                this.transSuperChat(danmu);
                break;
            case 'SUPER_CHAT_MESSAGE_JPN':
                //说出来你们可能不信，sc还有专门的日文包的，参数和上面基本一致 $data
                /**
                 * 多了一个 message_jpn => 日文翻译草，我寻思这要是其他语种的v多了你要怎么整
                 */
                break;
            case 'ACTIVITY_BANNER_UPDATE_V2':
                /**
                 * title => 第几名
                 */
                break;
            case 'COMBO_END':
                /**
                 * action:"投喂"
                    batch_combo_num:1
                    combo_num:1
                    end_time:1584118575
                    gift_id:30509
                    gift_name:"喵呀"
                    gift_num:1
                    guard_level:0
                    price:1000
                    r_uname:"Overidea_China"
                    ruid:18149131
                    send_master:{}
                    start_time:1584118575
                    uid:281764256
                    uname:"Frpaw"
                 */
                break;
            case 'COMBO_SEND':
                /**
                 * 这些combo不想处理了
                 */
                break;
            case 'PREPARING':
                /**
                 * 不知道是个啥，好像暂时没啥用
                 */
                break;
            case 'WEEK_STAR_CLOCK':
                /**
                 * 周星的信息，没啥用
                 */
                break;
            case 'RAFFLE_START':
                /**
                 * 这个是抽奖用的，暂时不需要哦，做挂机脚本可能需要
                 */
                break;
            case 'HOUR_RANK_AWARDS':
                /**
                 * 小时排行榜观众还有奖拿就很神奇
                 */
                break;
            case 'GUARD_BUY':
                //看了一下底下的消息，还是就用这个好了，底下两个都和抽奖有关，弹幕姬不需要抽奖
                /**
                 * gift_name : ep=>舰长
                 * guard_level : number:[1,2,3]
                 * num :
                 * price : 金瓜子数
                 * start_time : 不需要
                 * end_time : 不需要
                 * uid : 
                 * username : 
                 */
                //装载一下头像
                //设置一下基础信息
                const gb = msg['data'];
                danmu = await Guard(gb['username'],gb['uid'],gb['price'],gb['guard_level']);
                this.transGuard(danmu);
                break;
            case 'GUARD_MSG':
                /**
                 * msg : 可能要用正则提取一下 ?${uname}:?在本房间开通了舰长
                 */
                break;
            case 'GUARD_LOTTERY_START':
                /**
                 * lottery : { sender : { face : string , uid : number , uname : string } }
                 */
                break;
            case 'ROOM_BANNER':
                /**
                 * 不知道是个啥，不过好像没啥用
                 */
                break;
            case 'PANEL':
                /**
                 * data : { biz_id : ?, icon : ?, is_outer : ?, jump_url : ?, note: 'xx版 第x名', operate: ?, status_type: ?, title : '榜', weight: ? }
                 */
                break;
            default:
                console.log(msg);
                break;
        }
    }

    //传输弹幕
    transDanmu(){
        if(this.temp_danmus.length > 0){
            //dispatch巨tm消耗性能，考虑满一定大的量再入库
            //store.dispatch('ADD_DANMUS',this.temp_danmus);
            typeof this.onDanmu === 'function' && this.onDanmu(this.temp_danmus);
            //清理缓存，不清要死人了，内存暴增太可怕了草
            delete this.temp_danmus;
            this.temp_danmus = [];
        }
    }

    //传输sc
    transSuperChat(scs){
        typeof this.onSC === 'function' && this.onSC(scs);
    }

    //传输礼物，辣条在检测完之后才会传输，普通礼物比较少，所以单个单个传
    transGift(gift){
        typeof this.onGift === 'function' && this.onGift(gift);
    }

    //传输舰队信息
    transGuard(guard){
        typeof this.onGuard === 'function' && this.onGuard(guard);
    }

    //实时直播信息
    transLiveInfo(info){
        typeof this.onLiveInfo === 'function' && this.onLiveInfo(info);
    }
}