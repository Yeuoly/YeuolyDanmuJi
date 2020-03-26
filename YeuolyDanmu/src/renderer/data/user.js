import axios from 'axios';
import api from '../settings/api';
import qs from 'querystring';

import { OrdinaryEventBus } from '../events/evnetBus';
import { MessageBox } from 'element-ui';

class Account{
    id;uid;face;class;login_time;

    setAcoountName(name){ this.id = name; }
    setAccountUid(uid){ this.uid = uid; }
    setAccountFace(face){ this.face = face; }
    setAccountClass(className){ this.class = className; }
    setAccountLoginTime(login_time){ this.login_time = login_time; }
    get( cb ){
        cb(this.id,this.uid,this.face);
    }
}

export default {
    master : new Account(),
    async init(){
        try{
            const r = await axios.post(api.yeuoly_account_ordinary_action,qs.stringify({ act : 0 }));
            const data = r.data;
            if(data['data']['res'] === 666){
                const res = data['data']['data'];
                this.master.setAcoountName(res['user_id']);
                this.master.setAccountUid(res['user_uid']);
                this.master.setAccountClass(res['user_class']);
                this.master.setAccountLoginTime(res['login_time']);
                const p = await axios.post(`${api.yeuoly_account_ordinary_action}?act=3&uid=${res['user_uid']}`);
                this.master.setAccountFace(p.data['data']['data']['face']);
                OrdinaryEventBus.$emit('master-login-succeed');
            }
        }catch(e){
            MessageBox.alert('与服务器连接出错','YeuolySystem');
        }
    }
}