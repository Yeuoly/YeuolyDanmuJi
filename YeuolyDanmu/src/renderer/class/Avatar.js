import axios from 'axios';
import api from '../settings/api';
import Store from 'electron-store';
import HashList from './HashList';

/**
 * 3e8次计算平均585ms（计算能力一般的笔记本 N3450 1.10Ghz）
 */

const store = new Store();

//每多temp_max_count个头像入一次库
const temp_max_count = 20;
let append_count = 0;

//别数了，一共256个数组，是原始数据
const store_avatar = store.get('avatars-cache') || [
    [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
];

const avatars = new HashList(2);
avatars.cover(store_avatar, 2);

//默认头像
const defualt_avatar = 'http://i0.hdslb.com/bfs/album/6389ef2f437a4b00d0dc863b44f4084bf6b4165a.jpg';

export const saveAvatars = () => {
    store.set('avatars-cache',avatars.getOrigin());
}

//整活整活，Promise还挺好用
export const getAvatar = uid => new Promise( async resolve => {
    const handle = avatars.operateByNumber(uid).get();
    if(handle){
        handle[0]++;
        resolve(handle[1]);
    }else{
        try{
            const { data } = await axios.get(`${api.bili_get_space_info}?mid=${uid}`);
            if(data['code'] !== 0){
                resolve(defualt_avatar);
                return;
            }
            avatars.operateByNumber(uid).set([1, data['data']['face'], uid]);
            if(++append_count === temp_max_count){
                saveAvatars();
                append_count = 0;
            }
            resolve(data['data']['face']);
        }catch(e){
            resolve(defualt_avatar);
        }
    }
}); 

export const getAvatarOrigin = () => avatars.getOrigin();

export const getAvatarCount = () => avatars.getOriginLength();

export const setAvatar = ( uid, src ) => {
    avatars.operateByNumber(uid).change( item => {
        item[1] = src;
    });
}

export const getAvatarsList = () => avatars.clone();