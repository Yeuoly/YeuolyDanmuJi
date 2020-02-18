import api from '../settings/api';
import axios from 'axios';
import Warning from './Warning';
import INFO from './Info';
import MessageHandler from './MessageHandler';

import { BiliDataEncoder, BiliDataCoder, BiliDataDecoder } from './DataCoder';

import Utils from './Utils';

const platform = 'web';
const heart_beat_time = 30000;
const reconnect_time = 5000;

//定义弹幕加载类
export default class DanmuLoader{
    constructor(room_id){
        this.room_id = room_id;
        this.init_base_pramas();
        this.init_base_instance();
    }

    //初始化基础参数
    init_base_pramas(){
        this.server_list = [];
        this.token = '';
        this.heart_beat_times = 0;
    }

    //初始化实例
    init_base_instance(){
        this.socket = null;
        this.heart_beat_interval = null;
    }

    //加载入口
    startLoader(){
        //获取服务器信息与token
        this.getConf(() => {
            let host_index = 0;
            this.socket = new WebSocket(
                `wss://${this.server_list[host_index]['host']}:${this.server_list[host_index]['wss_port']}/sub`
            );
            this.socket.onmessage = e => {
                this.onMessage(e);
            };
            this.socket.onopen = e => {
                this.onOpen(e);
            };
            this.socket.onerror = e => {
                this.onError(e);
            };
            this.socket.onclose = e =>{
                this.onClose(e);
            }
        });
    }

    //获取服务器信息与token
    getConf(successHook){
        axios.get(api.bili_get_room_conf,{
            room_id : this.room_id,
            platform : platform
        }).then( response => {
            const data = response.data;
            if(data['code'] === 0){
                this.server_list = data['data']['host_server_list'];
                this.token = data['data']['token'];
                setTimeout(successHook,0);
            }else{
                new Warning('DanmuLoader','获取房间信息失败');
            }
        }).catch(() => {
            new Warning('DanmuLoader','获取房间信息失败');
        });
    }

    //处理消息
    onMessage(e){
        INFO.log('RevMsg','获取到新数据');
        const data = e.data;
        const bili_decoder = new BiliDataDecoder(data, self => {
            //睿站这里有个很蛋疼的地方，一次传输的消息可能有好几个封装，需要在这里分离开，你说你老老实实用JSON它不香吗
            let extrme_len = 1;
            while(extrme_len > 0){
                switch(self.getOp()){
                    case 8:
                        INFO.log('SuccessHandShaking','握手成功，正在加载心跳……','green');
                        //开始心跳循环
                        this.heartBeat();
                        this.heart_beat_interval = setInterval(() => { this.heartBeat() }, heart_beat_time);
                        break;
                    case 3:
                        //心跳成功
                        this.heart_beat_times++;
                        INFO.log('HeartBeat',`心跳成功！心跳-总次数:${this.heart_beat_times}`);
                        break;
                    case 5:
                        //处理数据主体
                        INFO.log('RevMsg','接受到主流消息');
                        const data_buf = self.getBodyBuffer();
                        const message_handler = new MessageHandler();
                        const data_json = Utils.transFormatFromBufferToJson(data_buf);
                        message_handler.handleMessage(data_json);
                        break;
                }
                extrme_len = bili_decoder.getLastLen();
                if(extrme_len){
                    bili_decoder.replaceCurrent();
                }
            }
        });
    }

    //心跳
    heartBeat(){
        INFO.log('HeartBeat','发送心跳中……');
        const bili_coder = new BiliDataCoder();
        bili_coder.setHeaderDetail(2,1,1);
        this.socket.send(bili_coder.getHeaderBuffer());
    }

    //第一次连接发送身份验证
    onOpen(e){
        INFO.log('WSConnection','连接成功，正在进行握手……','green');
        const auth_info =JSON.stringify({
            'uid':       0,
            'roomid':    this.room_id,
            'protover':  1,
            'platform':  platform,
            'clientver': '1.8.2',
            'type':      2,
            'key':       this.token
        });

        const body_buf = new TextEncoder().encode(auth_info);
        const bili_coder = new BiliDataCoder();
        bili_coder.setHeaderDetail(7,1,1);
        bili_coder.setBody(new DataView(new Uint8Array(body_buf).buffer));
        this.socket.send(bili_coder.getAllBuffer());
    }

    onClose(e){
        INFO.log('WSConnection','连接断开:'+e.reason);
    }

    onError(e){
        INFO.error('ERROR','与服务器连接出错，将在五秒内尝试重连');
        setTimeout(() => {
            this.socket.close(0);
            this.startLoader();
        },reconnect_time);
    }
}