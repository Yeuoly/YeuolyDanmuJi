import Store from 'electron-store';
import api from '../settings/api';
import axios from 'axios';
import INFO from '../class/Info';

const store = new Store();
let data = store.get('room_ids',{
    current : 1534600,
    history : []
});

export let room_id_controller = {
    ...data,
    getCurrent(){
        return this.current;
    },
    save(){
        store.set('room_ids',{ current : this.current , history : this.history });
    },
    remove(id){
        for(let i in this.history){
            if(this.history[i].room_id === id){
                this.history.splice(i,1);
                this.save();
                return;
            }
        }
    },
    setCurrent(id){
        this.current = id;
        this.addToHistory(id, info => {
            this.history.push(info);
            this.save();
        });
        this.save();
    },
    addToHistory(id,fn_suc){
        for(let i in this.history){
            if(this.history[i].room_id === id)return; 
        }
       this.getRoomInfo(id,fn_suc);
    },
    getRoomInfo(id,fn_suc){
        axios.get(`${api.bili_get_live_info}?room_id=${id}`).then( r => {
            const data = r.data;
            if(data['code'] !== 0){
                INFO.error('GET_LIVE_INFO',`代号:${data['code']}`);
                fn_suc({
                    short_id : 0,
                    room_id : id,
                    date : new Date().format('MM-dd hh:mm:ss'),
                    up_name : '加载失败',
                    title : '加载失败',
                    live_status : 0
                });      
            }else{
                fn_suc({
                    short_id : data['data']['room_info']['short_id'],
                    room_id : data['data']['room_info']['room_id'],
                    title : data['data']['room_info']['title'],
                    date : new Date().format('MM-dd hh:mm:ss'),
                    up_name : data['data']['anchor_info']['base_info']['uname'],
                    live_status : data['data']['room_info']['live_status']
                });
            }
        });
    }
}