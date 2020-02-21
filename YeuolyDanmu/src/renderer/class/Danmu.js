import { User , Medal , Guard } from './User'

export default class Danmu{
    constructor(
        user_id,user_uid,message,
        medal_level,medal_nickname,medal_up,
        live_ul,live_ul_rank
    ){
        this.user = new User(user_id,user_uid,null,0,live_ul,live_ul_rank);
        this.medal = new Medal(medal_level,medal_nickname,medal_up);
        this.message = message;
        this.type = 'normal';
    }

    getUserInfo(){ return this.user; }
    getDanmuMsg(){ return this.message; }
    getLv(){ return this.live_ul; }
}

export class SuperChat{
    constructor(){
        //
    }
}