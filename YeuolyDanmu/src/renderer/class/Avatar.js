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
const store_avatar = store.get('store-avatars') || [
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
    store.set('store-avatars',avatars.getOrigin());
}

//采用回调的形式
export const getAvatar = async ( uid, fn ) => {
    const _a = avatars.operate(uid).get().result;
    if(!_a){
        try{
            const r = await axios.get(`${api.bili_get_space_info}?mid=${uid}`);
            const data = r.data;
            if(data['code'] === 0){
                avatars.operate().set({
                    times : 1,
                    src : data['data']['face']
                });
                fn(data['data']['face']);
                append_count++;
                if(append_count === temp_max_count){
                    saveAvatars();
                    append_count = 0;
                }
            }else{
                fn(defualt_avatar);
            }
        }catch(e){
            fn(defualt_avatar);
        }
    }else{
        avatars.operate().change( item => {
            item['times']++;
        });
        fn(_a['src']);
    }
}