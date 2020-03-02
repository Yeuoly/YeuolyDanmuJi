import api from '../settings/api';
import axios from 'axios';
import INFO from './Info';
import MessageHandler from './MessageHandler';

import { BiliDataCoder, BiliDataDecoder } from './DataCoder';

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
        this.host_index = 0;
    }

    //初始化实例
    init_base_instance(){
        this.socket = null;
        this.heart_beat_interval = null;
        this.message_handler = new MessageHandler();
        //挂载新增弹幕钩子，当有新弹幕传输的时候会调用onDanmu
        this.message_handler.onDanmu = danmu => {
            typeof this.onDanmu === 'function' && this.onDanmu(danmu);
        }
        this.message_handler.onSC = sc => {
            typeof this.onSC === 'function' && this.onSC(sc);
        }
        this.message_handler.onGift = gift => {
            typeof this.onGift === 'function' && this.onGift(gift);
        }
    }

    onDanmu = null;

    setRoomID(room_id){
        this.room_id = room_id;
    }

    getRoutesCount(){
        return this.server_list.length;
    }

    setRoute(index){
        this.host_index = index;
    }

    //加载入口，提供两个钩子，一个成功调用，一个用于修改连接状态为关闭
    startLoader(fn_suc,fn_fai){
        INFO.log('WSConnection',`开始连接至直播间，当前房间号：${this.room_id}`);
        //获取服务器信息与token
        this.getConf(() => {
            let host_index = this.host_index;
            this.socket = new WebSocket(
                `wss://${this.server_list[host_index]['host']}:${this.server_list[host_index]['wss_port']}/sub`
            );
            this.socket.onmessage = e => {
                this.onMessage(e);
            };
            this.socket.onopen = e => {
                setTimeout(fn_suc,0);
                this.onOpen(e);
            };
            this.socket.onerror = e => {
                setTimeout(fn_fai,0);
                this.onError(e);
            };
            this.socket.onclose = e =>{
                setTimeout(fn_fai,0);
                this.onClose(e);
            }
        });
    }

    //关闭，成功后调用这个钩子
    closeLoader(fn){
        this.socket.close(3001);
        delete this.socket;
        this.heart_beat_times = 0;
        clearInterval(this.heart_beat_interval);
        setTimeout(fn, 0);
        INFO.log('WSConnection','连接已断开','green');
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
                INFO.error('DanmuLoader','获取房间信息失败');
            }
        }).catch(() => {
            INFO.error('DanmuLoader','获取房间信息失败');
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
                        const data_json = Utils.transFormatFromBufferToJson(data_buf);
                        this.message_handler.handleMessage(data_json);
                        break;
                }
                extrme_len = bili_decoder.getLastLen();
                if(extrme_len){
                    //当有剩余弹幕时替换当前信息为分割出来的后一部分信息
                    /**
                     * 可能有一堆人不明白这玩意的作用
                     * 
                     * 原本的弹幕信息是 { 1.header => [opt] | 1.main => [json] } | { 2.header => [opt] | 2.main....
                     * 这样的形式，biliCoder通过1.header内的opt信息分割出第一分部作为主体部分，后面 2 3 4 5 6全部作为剩余部分保存起来
                     * 当剩余部分的长度>0时说明有剩余，调用replaceCurrent()将主体部分替换为2,后面 3 4 5 6再作为剩余部分
                     * 一直这样循环直到剩余部分长度为0
                     * 详细请看DataCoder.js内BiliDataCoder的实现
                     */
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
            this.socket.close(3001);
            this.startLoader();
        },reconnect_time);
    }
}