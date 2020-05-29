import Utils from '../modules/Utils';

//头部偏移、长度
const raw_header_len = 16;
const packet_offset = 0;
const header_offset = 4;
const ver_offset = 6;
const op_offset = 8;
const seq_offset = 12;

export class BiliDataCoder{
    constructor(){
        const header_ary = new ArrayBuffer(raw_header_len);
        //类型均为DataView，方便操作
        this.header = new DataView(header_ary);
        this.body = null;
        this.data = null;
        this.last = null;
    }

    //设置发送向Bili的头部信息
    setOp(v){ this.header.setUint32(op_offset, v); }
    setSeq(v){ this.header.setUint32(seq_offset, v); }
    setVer(v){ this.header.setUint16(ver_offset, v); }
    setHeaderLen(v){ this.header.setUint16(header_offset, v || raw_header_len); }
    setPacketLen(v){ this.header.setUint32(packet_offset, v || raw_header_len); }

    setHeader(v){ this.header = v; }
    setBody(v){ 
        this.body = v;
        const body_len = v.buffer.byteLength;
        this.setPacketLen(body_len + raw_header_len);
    }

    setHeaderDetail(op,seq,ver,pk_len){
        this.setOp(op);
        this.setVer(ver);
        this.setSeq(seq);
        this.setHeaderLen();
        this.setPacketLen(pk_len || 0);
    }
    //获取Bili返回的头部信息
    getOp(){ return this.header.getUint32(op_offset); }
    getSeq(){ return this.header.getUint32(seq_offset); }
    getVer(){ return this.header.getUint16(ver_offset); }
    getHeaderLen(){ return this.header.getUint16(header_offset); }
    getPacketLen(){ return this.header.getUint32(packet_offset); }
    getLastLen(){ return this.last.buffer.byteLength; }

    getHeaderView(){ return this.header; }
    getBodyView(){ return this.body; }

    getAllBuffer(){ return Utils.mergeArrayBuffer(this.header.buffer,this.body.buffer); }
    getHeaderBuffer(){ return this.header.buffer; }
    getLastBuffer(){ return this.last.buffer; }
    getBodyBuffer(){ return this.body.buffer; }
    getHeaderArray(){ return new Uint8Array(this.header); }
    getBodyArray(){ return new Uint8Array(this.body); }
    getLastArray(){ return new Uint8Array(this.last); }

    //初始化
    init(buf){
        /**信息的真实长度：一条信息中可能有很多条弹幕，每条弹幕都是完全分开的，这里需要截开不同的弹幕
         * 将buf中弹幕的第一部分作为主体分割出来，并获取其header内的信息，剩余分布保存
         */
        const real_len = buf.byteLength;
        //头部信息
        const header_buf = buf.slice(0,raw_header_len);
        const header_view = new DataView(header_buf);
        //第一分部的实际长度
        const current_packet_len = header_view.getUint32(packet_offset);
        const body_buf = buf.slice(raw_header_len,current_packet_len);
        const data_buf = buf.slice(0,current_packet_len);
        //截开，保留多出来的部分
        const last_buf = buf.slice(current_packet_len,real_len);
        const body_view = new DataView(body_buf);
        const data_view = new DataView(data_buf);
        const last_view = new DataView(last_buf);
        this.data = data_view;
        this.header = header_view;
        this.body = body_view;
        this.last = last_view;
    }

    //将现有数据换成last中的
    replaceCurrent(){
        const temp = this.last.buffer;
        this.init(temp);
    }
}

export class BiliDataDecoder extends BiliDataCoder{
    //转Blob为DataView，由于为异步读取，所以构造函数内提供了钩子接口
    constructor(blob,fn) {
        super();
        const self = this;
        const blob_reader = new FileReader();
        blob_reader.readAsArrayBuffer(blob);
        blob_reader.onload = function(){
            self.init(this.result);
            typeof fn === 'function' && fn(self);
        }
    }
}