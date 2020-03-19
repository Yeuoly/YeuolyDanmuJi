import { User , Medal } from './User'

import GiftStation from './GiftStation';
import { global_settings } from '../settings/global_settings';

/**
 * 所有弹幕、礼物、SC都广义定义为弹幕
 */

export default class Danmu{
    constructor(
        user_id,user_uid,message,
        medal_level,medal_nickname,medal_up,
        live_ul,live_ul_rank,
        guard_type
    ){
        this.user = new User(user_id,user_uid,null,0,live_ul,live_ul_rank);
        this.medal = new Medal(medal_level,medal_nickname,medal_up,0);
        this.message = message;
        this.type = 'normal';
        this.guard_type = guard_type;
    }

    getUserInfo(){ return this.user; }
    getDanmuMsg(){ return this.message; }
    getLv(){ return this.live_ul; }
}

class SuperChatBase{
    constructor(price,start_time,end_time,
        background_color,background_color_bottom,price_color,background_image,){
        this.price = price;
        this.start_time = start_time;
        this.end_time = end_time;
        this.background_color = background_color;
        this.background_color_bottom = background_color_bottom;
        this.price_color = price_color;
        this.background_image = background_image;
    }
}

export class SuperChat extends SuperChatBase{
    constructor(
        user_id,user_uid,message,
        medal_level,medal_nickname,medal_up,
        live_ul,
        price,start_time,end_time,
        background_color,background_color_bottom,price_color,background_image,
        face,
    ){
        super(price,start_time,end_time,background_color,background_color_bottom,price_color,background_image);
        this.type = 'super_chat';
        this.message = message;
        this.user = new User(user_id,user_uid,face,0,live_ul,'none');
        this.medal = new Medal(medal_level,medal_nickname,medal_up,0);
    }
}

export class Guard{
    constructor(user,type,price){
        this.type = 'guard';
        this.guard_type = type; // 0无 1舰长 2提督 3总督 
        this.user = user;
        this.price = price;
        //初始化一下
        const info = GiftStation.getGuardInfo(type);
        this.name = info['name'];
        this.img = info['img'];
    }
}

export class Gift{
    constructor(
        user_id,user_uid,face,
        gift_id,gift_name,gift_price,gift_num,
        is_super
    ){
        this.type = 'gift';
        this.user = new User(user_id,user_uid,face,0,0,0);
        this.gift_id = gift_id;
        this.gift_name = gift_name;
        this.gift_price = gift_price;
        this.gift_num = gift_num;
        this.gift_image = GiftStation.getGiftImage(gift_id);
        this.is_super = is_super;
        this.initMessage();
    }

    initMessage(){
        this.message = `${global_settings['display_module']['gift_greet']}${this.gift_num}个${this.gift_name}`;
    }
}