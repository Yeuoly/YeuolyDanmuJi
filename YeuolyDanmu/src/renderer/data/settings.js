import Store from 'electron-store';
import api from '../settings/api';
import axios from 'axios';
import INFO from '../class/Info';
import Utils from '../class/Utils';

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
        this.addToHistory(id);    
    },
    addToHistory(id){
        return new Promise( async reslove => {
            if(!this.history.map( v => v.room_id ).includes(id)){
                const data = await this.getRoomInfo(id);
                this.history.push(data);
                this.save();
                reslove(data);
            }
        });
    },
    getHistory(){
        return this.history;
    },
    getRoomInfo(id){
        return new Promise( async reslove => {
            const { data } = await axios.get(`${api.bili_get_live_info}?room_id=${id}`);
            if(data['code'] !== 0){
                INFO.error('GET_LIVE_INFO',`代号:${data['code']}`);
                reslove({
                    short_id : 0,uid : 0,
                    room_id : id,
                    date : Utils.formatDate(new Date(),'MM-dd hh:mm:ss'),
                    up_name : '加载失败',
                    title : '加载失败',
                    live_status : 0
                });
            }else{
                reslove({
                    short_id : data['data']['room_info']['short_id'],
                    room_id : data['data']['room_info']['room_id'],
                    uid : data['data']['room_info']['uid'],
                    title : data['data']['room_info']['title'],
                    date : Utils.formatDate(new Date(),'MM-dd hh:mm:ss'),
                    up_name : data['data']['anchor_info']['base_info']['uname'],
                    live_status : data['data']['room_info']['live_status']
                });
            }
        })
    }
}

export const filter_danmu_controller = {
    black_list : [
        '哔哩哔哩 (゜-゜)つロ 干杯~',
        '来拥抱勇气和爱呀（*/ω＼*）'
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