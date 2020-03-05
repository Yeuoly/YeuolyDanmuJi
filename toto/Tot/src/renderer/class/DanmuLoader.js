import axios from 'axios';
import api from '../const/api';
import { BiliDataCoder , BiliDataDecoder } from './DataCoder';
import Utils from './Utils';

export default class DanmuLoader{
    constructor(){
        this.room_id = 1440094;
        this.token = '';
        this.host_server_list = [];
        this.socket = null;
    }

    async startLoader(){
        const i = await this.getRoomConf();
        this.socket = new WebSocket(`wss://${this.host_server_list[0]['host']}:${this.host_server_list[0]['wss_port']}/sub`);
        this.socket.onopen = e => {
            this.onOpen(e);
        };
        this.socket.onclose = e => {
            this.onClose(e);
        };
        this.socket.onmessage = e => {
            this.onMessage(e);
        };
        this.socket.onerror = e => {
            this.onError(e);
        }
    }

    async getRoomConf(){
        try{
            const response = await axios.get(`${api.bili_get_room_conf}?room_id=${this.room_id}&platform=pc&player=web`);
            const data = response.data;
            if(data['code'] === 0){
                this.token = data['data']['token'];
                this.host_server_list = data['data']['host_server_list'];
            }else{
                //
            }
        }catch(e){
            //
        }
    }

    heartBeat(){
        const coder = new BiliDataCoder()
        coder.setHeaderDetail(2,1,1);
        this.socket.send(coder.getHeaderBuffer());
    }

    onOpen(e){
        console.log('通讯打开');
        //开始认证
        const auth_info = JSON.stringify({
            'uid':       0,
            'roomid':    this.room_id,
            'protover':  1,
            'platform':  'web',
            'clientver': '1.8.2',
            'type':      2,
            'key':       this.token
        });
        const body_buf = new TextEncoder().encode(auth_info);
        const coder = new BiliDataCoder();
        coder.setHeaderDetail(7,1,1);
        coder.setBody(new DataView(new Uint8Array(body_buf).buffer));
        this.socket.send(coder.getAllBuffer());
    }

    onClose(e){
        console.log('通讯关闭');
    }

    onMessage(e){
        const coder = new BiliDataDecoder(e.data, () => {
            let last_len = 1;
            while(last_len > 0){
                switch(coder.getOp()){
                    case 3:
                        console.log('心跳成功');
                        //心跳成功
                        break;
                    case 5:
                        //礼物、弹幕、SC信息
                        const data_buf = coder.getBodyBuffer();
                        const data_json = Utils.transFormatFromBufferToJson(data_buf);
                        
                        break;
                    case 8:
                        //握手成功
                        this.heartBeat();
                        const timer = setInterval( () => { this.heartBeat(); } , 30000 );
                        break;
                }
                last_len = coder.getLastLen();
                if(last_len){
                    coder.replaceCurrent();;
                }
            }
        });
    }

    onError(e){
        console.log('通讯异常');
    }

    onDanmu( danmu ){
        //do something
    }

    setOnDanmu( fn ){
        this.onDanmu = fn;
    }

    setRoomID(id){
        this.room_id = id;
    }
}