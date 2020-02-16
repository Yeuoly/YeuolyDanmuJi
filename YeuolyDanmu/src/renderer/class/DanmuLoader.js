import api from '../settings/api';
import axios from 'axios';
import Warning from './Warning';
import Info from './Info';

//定义弹幕加载类
export default class DanmuLoader{
    constructor(room_id){
        this.room_id = room_id;
        this.init_base_pramas();
        this.init_base_instance();
    }

    //头部偏移、长度
    raw_header_len = 16;
    packet_offset = 0;
    header_offset = 4;
    ver_offset = 6;
    op_offset = 8;
    seq_offset = 12;

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
        this.info_instance = new Info();
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
            platform : 'h5'
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
        const data = e.data;
        const reader = new FileReader();
        reader.readAsArrayBuffer(data);
        const vm = this;
        //读取Blob为ArrayBuffer
        reader.onload = function(){
            var dataView = new DataView(this.result, 0);
            var packetLen = dataView.getUint32(vm.packet_offset);
            if (dataView.byteLength >= packetLen) {
                var headerLen = dataView.getInt16(vm.header_offset);
                var ver = dataView.getInt16(vm.ver_offset);
                var op = dataView.getUint32(vm.op_offset);
                var seq = dataView.getUint32(vm.seq_offset);
                switch (op) {
                case 8:
                    vm.info_instance.log('SuccessShaking','握手成功，正在加载心跳');
                    //开始心跳循环
                    vm.heartBeat(vm);
                    vm.heart_beat_interval = setInterval(() => {
                        vm.heartBeat(vm);
                    }, 30000);
                    break;
                case 3:
                    //获取人气值
                    const renqi = dataView.getInt32(16);
                    break;
                case 5:
                    //处理数据主体
                    var packetView = dataView;
                    var msg = this.result;
                    var msg_body;
                    for (var offset = 0; offset < msg.byteLength; offset += packetLen) {
                        packetLen = packetView.getUint32(offset);
                        headerLen = packetView.getInt16(offset + vm.header_offset);
                        //获取数据主体
                        msg_body = msg.slice(offset + headerLen , offset + packetLen);
                        //解码，至今没成功
                        let str = new TextDecoder('utf-8').decode(msg_body);
                        vm.info_instance.log('HandleRevData',str);
                    }
                    break;
                }
            }
        }
    }

    //心跳
    heartBeat(vm){
        this.info_instance.log('HeartBeat',`心跳-总次数:${this.heart_beat_times}`);
        const header_buf = new ArrayBuffer(vm.raw_header_len);
        const header_view = new DataView(header_buf, 0);
        header_view.setInt32(vm.packet_offset, vm.raw_header_len);
        header_view.setInt16(vm.header_offset, vm.raw_header_len);
        header_view.setInt16(vm.ver_offset, 1);
        header_view.setInt32(vm.op_offset, 2);
        header_view.setInt32(vm.seq_offset, 1);
        vm.socket.send(header_buf);
        this.heart_beat_times++;
    }

    //第一次连接发送身份验证
    onOpen(e){
        this.info_instance.log('WSConnection','连接成功，正在进行握手……');
        const auth_info =JSON.stringify({
            'uid':       0,
            'roomid':    this.room_id,
            'protover':  2,
            'platform':  'web',
            'clientver': '1.8.2',
            'type':      2,
            'key':       this.token
        });
        const header_buf = new ArrayBuffer(this.raw_header_len);
        const header_view = new DataView(header_buf,0);
        const body_buf = new TextEncoder().encode(auth_info);
        header_view.setInt32(this.packet_offset, this.raw_header_len + body_buf.byteLength);
        header_view.setInt16(this.header_offset,this.raw_header_len);
        header_view.setInt16(this.ver_offset,1);
        header_view.setInt32(this.seq_offset,1);
        header_view.setInt32(this.op_offset,7)
        this.socket.send(this.mergeArrayBuffer(header_buf,body_buf));
    }

    onClose(e){
        this.info_instance.log('WSConnection','连接断开:'+e.reason);
    }

    onError(e){

    }

    mergeArrayBuffer(ab1, ab2) {
        var u81 = new Uint8Array(ab1),
        u82 = new Uint8Array(ab2),
        res = new Uint8Array(ab1.byteLength + ab2.byteLength);
        res.set(u81, 0);
        res.set(u82, ab1.byteLength);
        return res.buffer;
    }
}