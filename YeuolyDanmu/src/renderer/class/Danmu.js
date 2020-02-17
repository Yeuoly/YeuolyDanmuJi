export default class Danmu{
    constructor(
        user_id,user_uid,message,
        medal_level,medal_nickname,medal_up,
        live_ul,live_ul_rank
    ){
        this.user = { uid : user_uid, id : user_id };
        this.medal = { lv : medal_level, name : medal_nickname, up : medal_up };
        this.live_ul = { lv : live_ul , rank : live_ul_rank };
        this.message = message;
    }

    isDanmu = true;

    getUserInfo(){ return this.user; }
    getDanmuMsg(){ return this.message; }
    getLv(){ return this.live_ul; }
}