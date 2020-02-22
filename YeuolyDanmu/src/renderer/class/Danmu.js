import { User , Medal , Guard } from './User'

export default class Danmu{
    constructor(
        user_id,user_uid,message,
        medal_level,medal_nickname,medal_up,
        live_ul,live_ul_rank
    ){
        this.user = new User(user_id,user_uid,null,0,live_ul,live_ul_rank);
        this.medal = new Medal(medal_level,medal_nickname,medal_up,0);
        this.message = message;
        this.type = 'normal';
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