export default class Danmu{
    constructor(message,user_id,user_uid,time,extrme){
        this.message = message;
        this.user_id = user_id;
        this.user_uid = user_uid;
        this.extrme = extrme;
        this.time = time;
    }

    get(){
        return this;
    }

    setMessage(message){
        this.message = message;
    }

    setUid(uid){
        this.user_uid = uid;
    }

    setUserID(user_id){
        this.user_id = user_id;
    }

    isOutdated(current_time,last_time){
        return current_time > last_time + this.time;
    }
}