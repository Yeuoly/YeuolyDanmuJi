<template>
    <div id="task-page">
        <el-row class="_row">
            <el-col :span="4">
                <div class="task-item"><el-button round 
                    type="primary" 
                    plain 
                    @click="startDanmuLoader" 
                    :disabled="started" 
                    :loading="starting"
                >
                    启动弹幕姬
                </el-button></div>
            </el-col>
            <el-col :span="4">
                <div class="task-item"><el-button round 
                    type="danger" 
                    plain   
                    @click="closeDanmuLoader" 
                    :disabled="!started"
                    :loading="closing"
                >
                    关闭弹幕姬
                </el-button></div>
            </el-col>
            <el-col :span="4" v-for="(i, key) in btns" :key="key">
                <div class="task-item"><el-button round 
                    type="info" 
                    plain   
                    @click="emitEvent(i.event)" 
                >
                    {{i.text}}
                </el-button></div>
            </el-col>
        </el-row>
        <p></p>
        <el-row>
            <el-col :span="24">
                <el-switch 
                    v-model="speaker.on"
                    active-text="启动语音助手"
                ></el-switch>
            </el-col>
            <el-col :span="24">
                <div class="text-grey text-12 left py4 px5">
                    音量
                </div>
                <el-slider v-model.lazy="speaker.volume" class="w90 p0 left"></el-slider>
            </el-col>
            <el-col :span="24">
                <div class="text-grey text-12 left py4 px5">
                    音调
                </div>
                <el-slider v-model.lazy="speaker.pitch" class="w90 p0 left"></el-slider>
            </el-col>
            <el-col :span="24">
                <div class="text-grey text-12 left py4 px5">
                    语速
                </div>
                <el-slider v-model.lazy="speaker.speed" class="w90 p0 left"></el-slider>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Loader from '../class/DanmuLoader';
import { OrdinaryEventBus } from '../events/evnetBus';

import { room_id_controller } from '../data/settings';
import { filter_danmu_controller } from '../data/settings';
import { global_settings } from '../settings/global_settings';

import { SuperChat, Gift, Guard, Danmu } from '../class/Danmu';

import { addGift, addLog, addSC, writeRecords, addDanmus, addGuard, clearStatistic } from '../data/records_ipc';
import { User } from '../class/User';
import Axios from 'axios';
import api from '../settings/api';
import Info from '../class/Info';
import { speaker_controller } from '../modules/speaker';

const ipc = require('electron').ipcRenderer;

export default {
    name : 'Task',
    data : () => ({
        DanmuLoader : new Loader(1534600),
        started : false,
        starting : false,
        closing :false,
        socket_sender : null,
        wirte_records_timer : null,
        speaker : {
            on : false,
            allow : true,
            volume : 100,
            pitch : 50,
            speed : 10,
            // voices : speaker_controller.getVoices(),
            // voice : speaker_controller.getVoices()[0]
        },
        btns : [{
            event : 'clear-danmu',
            text : '清空弹幕'
        },{
            event : 'clear-statistics',
            text : '清空统计'
        },{
            event : 'sc-30',
            text : '测试30SC'
        },{
            event : 'sc-50',
            text : '测试50SC'
        },{
            event : 'sc-100',
            text : '测试100SC'
        },{
            event : 'sc-500',
            text : '测试500SC'
        },{
            event : 'sc-1000',
            text : '测试1kSC'
        },{
            event : 'sc-2000',
            text : '测试2kSC'
        },{
            event : 'danmu',
            text : '测试弹幕'
        },{
            event : 'guard',
            text : '测试舰长'
        },{
            event : 'gift',
            text : '测试辣条'
        },{
            event : 'save-records',
            text : '保存日志'
        }]
    }),
    watch: {
        'speaker.volume' : {
            handler(v){ speaker_controller.setVolume(v / 100); },
            immediate : true
        },
        'speaker.pitch' : {
            handler(v){ speaker_controller.setPitch(v / 50); },
            immediate : true
        },
        'speaker.speed' : {
            handler(v){ speaker_controller.setSpeed(v / 10); },
            immediate : true
        },
        'speaker.voice' : {
            handler(v){ speaker_controller.setVoice(v); },
            immediate : true
        }
    },
    methods: {
        async emitEvent(e){
            switch(e){
                case 'clear-danmu':
                    ipc.send('to-danmu','clear');
                    break;
                case 'sc-30':
                    this.transSuperChat(await SuperChat(
                        '碧诗',2,'这是一条测试SC','','','','',30,0,0,'#EDF5FF','#2A60B2','#7497CD',
                        'https://i0.hdslb.com/bfs/live/1aee2d5e9e8f03eed462a7b4bbfd0a7128bbc8b1.png',
                        'https://i1.hdslb.com/bfs/face/3e60b20604b6fdc7d081eb6a1ec72aa47c5a3964.jpg'
                    ));
                    break;
                case 'sc-50':
                    this.transSuperChat(await SuperChat(
                        '碧诗',2,'这是一条测试SC','','','','',50,0,0,'#DBFFFD','#427D9E','#7DA4BD',
                        'https://i0.hdslb.com/bfs/live/1aee2d5e9e8f03eed462a7b4bbfd0a7128bbc8b1.png',
                        'https://i1.hdslb.com/bfs/face/3e60b20604b6fdc7d081eb6a1ec72aa47c5a3964.jpg'
                    ));
                    break;
                case 'sc-100':
                    this.transSuperChat(await SuperChat(
                        '碧诗',2,'这是一条测试SC','','','','',100,0,0,'#FFF1C5','#E2B52B','#ECCF75',
                        'https://i0.hdslb.com/bfs/live/1aee2d5e9e8f03eed462a7b4bbfd0a7128bbc8b1.png',
                        'https://i1.hdslb.com/bfs/face/3e60b20604b6fdc7d081eb6a1ec72aa47c5a3964.jpg'
                    ));
                    break;
                case 'sc-500':
                    this.transSuperChat(await SuperChat(
                        '碧诗',2,'这是一条测试SC','','','','',500,0,0,'#FFEAD2','#E09443','#E8AF79',
                        'https://i0.hdslb.com/bfs/live/1aee2d5e9e8f03eed462a7b4bbfd0a7128bbc8b1.png',
                        'https://i1.hdslb.com/bfs/face/3e60b20604b6fdc7d081eb6a1ec72aa47c5a3964.jpg'
                    ));
                    break;
                case 'sc-1000':
                    this.transSuperChat(await SuperChat(
                        '碧诗',2,'这是一条测试SC','','','','',1000,0,0,'#FFE7E4','#E54D4D','#EE8B8B',
                        'https://i0.hdslb.com/bfs/live/1aee2d5e9e8f03eed462a7b4bbfd0a7128bbc8b1.png',
                        'https://i1.hdslb.com/bfs/face/3e60b20604b6fdc7d081eb6a1ec72aa47c5a3964.jpg'
                    ));
                    break;
                case 'sc-2000':
                    this.transSuperChat(await SuperChat(
                        '碧诗',2,'这是一条测试SC','','','','',2000,0,0,'#FFD8D8','#AB1A32','#C86A7A',
                        'https://i0.hdslb.com/bfs/live/1aee2d5e9e8f03eed462a7b4bbfd0a7128bbc8b1.png',
                        'https://i1.hdslb.com/bfs/face/3e60b20604b6fdc7d081eb6a1ec72aa47c5a3964.jpg'
                    ));
                    break;
                case 'danmu':
                    this.transDanmus([await Danmu('Yeuoly',40691233,null,'测试弹幕',0,'','',0,'',0)]);
                    break;
                case 'gift':
                    this.transGift(await Gift('Yeuoly',40691233,null,1,'辣条',23300,233,false));
                    break;
                case 'guard':
                    this.transGuard(await Guard('Yeuoly',40691233,199000,3));
                    break;
                case 'save-records':
                    writeRecords();
                    break;
                case 'clear-statistics':
                    clearStatistic();
                    break;
                default:
                    console.log('w');
            }
        },
        //传输普通弹幕
        transDanmus(danmus){
            //向弹幕窗口发送新弹幕
            const filted_danmus = this.danmusFilter(danmus);
            ipc.send('to-danmu','trans-danmu',filted_danmus);
            //入库保存
            addDanmus(danmus);
            //语音
            if(this.speaker.on && this.speaker.allow){
                this.speaker.allow = false;
                speaker_controller.speakDanmu(danmus[0]);
            }
        },
        //传输sc
        transSuperChat(sc){
            ipc.send('to-danmu','trans-sc',sc);
            addSC(sc);
        },
        //传输gift
        transGift(gift){
            //这里最后需要做一点调整，把礼物全部传输到一个单独显示礼物的地方
            ipc.send('to-danmu','trans-gift',gift);
            addGift(gift);
        },
        //传输舰队信息
        transGuard(guard){
            ipc.send('to-danmu','trans-guard',guard);
            addGuard(guard);
        },
        transLiveInfo(info){
            ipc.send('to-danmu','trans-live-info',info);
        },
        //过滤弹幕
        danmusFilter(danmus){
            //这里会过滤掉常见的刷屏弹幕，比如噼哩噼哩干杯
            if(!global_settings['loading_module']['auto_filt_super_gift_danmu']){
                return danmus;
            }
            return danmus.filter( e => {
                return !filter_danmu_controller.in(e.message);
            });
        },
        //启动弹幕加载
        startDanmuLoader(){
            this.starting = true;
            const room_id = room_id_controller.current;
            //把弹幕分裂钩子挂到Loader上
            this.DanmuLoader.onDanmu = danmus => {
                this.transDanmus(danmus);
            }
            this.DanmuLoader.onSC = sc => {
                this.transSuperChat(sc);
            }
            this.DanmuLoader.onGift = gift => {
                this.transGift(gift);
            }
            this.DanmuLoader.onGuard = guard => {
                this.transGuard(guard);
            }
            this.DanmuLoader.onLiveInfo = info => {
                this.transLiveInfo(info);
            }
            this.DanmuLoader.setRoomID(room_id);
            this.DanmuLoader.startLoader( live_status => {
                //成功后的回调
                OrdinaryEventBus.$emit('start-loader');
                this.starting = false;
                this.started = true;
                this.wirte_records_timer = setInterval(() => {
                    writeRecords();
                },global_settings['log_module']['wirte_interval'] * 1000);
                //打开弹幕窗口，初始化窗口信息，避免重复打开
                if(!this.danmu_dialog_flag){
                    this.danmu_dialog_flag = true;
                }
                //然后发一下，这个是避免二次启动的时候初始化信息传不过去
                ipc.send('to-danmu','trans-live-info',live_status);
            });
        },
        closeDanmuLoader(){
            this.closing = true;
            this.DanmuLoader.closeLoader(() => {
                this.closing = false;
                this.started = false;
                this.starting = false;
                clearInterval(this.wirte_records_timer);
            });
        },
        
    },
    mounted() {
        //初始化语音助手
        speaker_controller.onEnd(() => { this.speaker.allow = true; });
    },
    beforeDestroy() {
        ipc.send('window-close-danmu');
        this.danmu_dialog_flag = false;
    },
}
</script>

<style>
    #task-page .el-button{
        width: 100%;
    }

    .task-item{
        padding-bottom: 5px;
        padding-right: 5px;
    }

</style>