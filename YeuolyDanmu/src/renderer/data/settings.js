import Store from 'electron-store';
import api from '../settings/api';
import axios from 'axios';
import INFO from '../class/Info';

const store = new Store();
let data = store.get('room_ids',{
    current : 1534600,
    history : []
});

//获取一波汇率
function getExchangerate (){
    axios.get(api.cny_get_exchangerate).then( response => {
        for(let i in response.data['rates']){
            cny_exchangerate_controller.rate[i] = response.data['rates'][i];
        }
        INFO.log('GET_CNY_EXCHANGERATE','获取汇率成功','green');
    }).catch( () => {
        INFO.warning('GET_CNY_EXCHANGERATE','获取汇率失败');
    });
}

getExchangerate();

export const room_id_controller = {
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
    getHistory(){
        return this.history;
    },
    getRoomInfo(id,fn_suc){
        axios.get(`${api.bili_get_live_info}?room_id=${id}`).then( r => {
            const data = r.data;
            if(data['code'] !== 0){
                INFO.error('GET_LIVE_INFO',`代号:${data['code']}`);
                fn_suc({
                    short_id : 0,
                    uid : 0,
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
                    uid : data['data']['room_info']['uid'],
                    title : data['data']['room_info']['title'],
                    date : new Date().format('MM-dd hh:mm:ss'),
                    up_name : data['data']['anchor_info']['base_info']['uname'],
                    live_status : data['data']['room_info']['live_status']
                });
            }
        });
    }
}

export const filter_danmu_controller = {
    black_list : [
        '哔哩哔哩 (゜-゜)つロ 干杯~',
        '来拥抱勇气和爱呀（*/ω＼*）',
    ],
    in(msg){
        return this.black_list.includes(msg);
    }
}

export const cny_exchangerate_controller = {
    rate : { CNY : 1, JPY : 15.252254, USD : 0.143038 },
    get(){
        return this.rate;
    },
    init(){
        getExchangerate();
    }
}