import axios from 'axios';
import md5 from 'md5';
import api from '../settings/api';
import qs from 'querystring';
import Store from 'electron-store';

const store = new Store();

//每多temp_max_count个头像入一次库
const temp_max_count = 10;

const avatar = store.get('avatars') || [];
if(avatar.length === 0){
    for(let i = 0; i < 16; i++){
        avatar.push([]);
        for(let k = 0; k < 16; k++){
            avatar[i].push([]);
        }
    }
}
const dict = { '0':0, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6,
                 '7':7, '8':8, '9':9, 'a':10, 'b':11, 'c':12, 'd':13, 'e':14, 'f':15 };
let more_count = 0;

//为了避免造成头像数据库太大了检索困难，这里hash分表，减少16*16倍检索量？
//等有需要了再做二次分表叭（

//默认头像
const defualt_avatar = 'http://i0.hdslb.com/bfs/album/6389ef2f437a4b00d0dc863b44f4084bf6b4165a.jpg';

const _find = hash => {
    const target = avatar[dict[hash[0]]] [dict[hash[1]]];
    for(let i in target){
        if(target[i].hash === hash){
            return target[i].url;
        }
    }
    return false;
}

const _set = ( hash, url ) => {
    avatar[dict[hash[0]]][dict[hash[1]]].push({
        hash : hash,
        url : url
    });
    more_count++;
    if(more_count % temp_max_count === 0 && more_count != 0){
        store.set('avatars',avatar);
    }
}

//采用回调的形式
export const getAvatar = ( uid, fn ) => {
    const hash = md5(uid);
    let url = _find(hash);
    if(url){
        fn(url);
    }else{
        axios.post('http://' + api.self_proxy, qs.stringify({
            proxy : JSON.stringify({
                url : api.bili_get_space_info,
                method : 'GET',
                data : {
                    mid : uid
                }
            })
        })).then( e => {
            const data = e.data;
            if(data['code'] === 0){
                _set(hash,data['data']['face']);
                fn(data['data']['face']);
            }else{
                fn(defualt_avatar);
            }
        }).catch(() => {
            fn(defualt_avatar);
        });
    }
}