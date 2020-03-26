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
            <el-col :span="4">
                <div class="task-item"><el-button round 
                    type="info" 
                    plain   
                    @click="clearDanmu" 
                >
                    清空弹幕姬
                </el-button></div>
            </el-col>
            <el-col :span="4">
                <div class="task-item"><el-button round 
                    type="info" 
                    plain   
                    @click="clearStatistic" 
                >
                    清空统计
                </el-button></div>
            </el-col>
            <el-col :span="4">
                <div class="task-item"><el-button round 
                    type="info" 
                    plain   
                    @click="refreshDanmuWindow" 
                >
                    唤醒弹幕窗口
                </el-button></div>
            </el-col>
            <el-col :span="4">
                <div class="task-item"><el-button round 
                    type="info" 
                    plain   
                    @click="testSC30" 
                >
                    测试30块SC
                </el-button></div>
            </el-col>
            <el-col :span="4">
                <div class="task-item"><el-button round 
                    type="info" 
                    plain   
                    @click="testSC50" 
                >
                    测试50块SC
                </el-button></div>
            </el-col>
            <el-col :span="4">
                <div class="task-item"><el-button round 
                    type="info" 
                    plain   
                    @click="testSC100" 
                >
                    测试100块SC
                </el-button></div>
            </el-col>
            <el-col :span="4">
                <div class="task-item"><el-button round 
                    type="info" 
                    plain   
                    @click="testSC500" 
                >
                    测试500块SC
                </el-button></div>
            </el-col>
            <el-col :span="4">
                <div class="task-item"><el-button round 
                    type="info" 
                    plain   
                    @click="testSC1000" 
                >
                    测试1k块SC
                </el-button></div>
            </el-col>
            <el-col :span="4">
                <div class="task-item"><el-button round 
                    type="info" 
                    plain   
                    @click="testSC2000" 
                >
                    测试2k块SC
                </el-button></div>
            </el-col>
            <el-col :span="4">
                <div class="task-item"><el-button round 
                    type="info" 
                    plain
                    @click="testDanmu" 
                >
                    测试弹幕
                </el-button></div>
            </el-col>
            <el-col :span="4">
                <div class="task-item"><el-button round 
                    type="info" 
                    plain   
                    @click="testGift" 
                >
                    测试辣条
                </el-button></div>
            </el-col>
            <el-col :span="4">
                <div class="task-item"><el-button round 
                    type="info" 
                    plain   
                    @click="testGuard" 
                >
                    测试舰长
                </el-button></div>
            </el-col>
            <el-col :span="4">
                <div class="task-item"><el-button round 
                    type="info" 
                    plain   
                    @click="saveRecords" 
                >
                    保存日志
                </el-button></div>
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

import Danmu from '../class/Danmu';
import { SuperChat , Gift , Guard } from '../class/Danmu';

import { addGift, addLog, addSC, writeRecords, addDanmus, addGuard, clearStatistic } from '../data/logs';
import { User } from '../class/User';
import Axios from 'axios';
import api from '../settings/api';
import Info from '../class/Info';
// const addSC = require('../data/logs').addSC;
// const addGift = require('../data/logs').addGift;

const ipc = require('electron').ipcRenderer;

export default {
    name : 'Task',
    data : () => ({
        DanmuLoader : new Loader(1534600),
        started : false,
        starting : false,
        closing :false,
        socket_sender : null,
        danmu_dialog_flag : false,
        danmu_dialog_id : 0,
        gift_dialog_id : 0,
        wirte_records_timer : null
    }),
    methods: {
        refreshDanmuWindow(){
            ipc.send('to-danmu','refresh-danmuwindow');
        },
        //传输普通弹幕
        transDanmus(danmus){
            //向弹幕窗口发送新弹幕
            ipc.send('to-danmu','trans-danmu',this.danmusFilter(danmus));
            //入库保存
            //但是叭。。这个弹幕量太大的时候我还没想好怎么处理数据。。所以弹幕先不入库了。。
            addDanmus(danmus);
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
                    this.openDanmuDialog(live_status);
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
        clearDanmu(){
            ipc.send('to-danmu','clear');
        },
        async openDanmuDialog(live_status){
            const win = await this.$Win.openWin({
                width: 300,
                height: 730,
                useContentSize: true,
                webPreferences : {
                    webSecurity : false
                },
                resizable: true,
                frame: false,
                titleBarStyle: false,

                windowConfig : {
                    router : '/danmu',
                    name : '弹幕窗口',
                    data : live_status
                }
            });
        },
        //伪造一个虚假的30块SC
        testSC30(){
            const test = new SuperChat(
                '碧诗',2,'这是一条测试SC','','','','',30,0,0,'#EDF5FF','#2A60B2','#7497CD',
                'https://i0.hdslb.com/bfs/live/1aee2d5e9e8f03eed462a7b4bbfd0a7128bbc8b1.png',
                'https://i1.hdslb.com/bfs/face/3e60b20604b6fdc7d081eb6a1ec72aa47c5a3964.jpg'
            );
            this.transSuperChat(test);
        },
        //伪造一个虚假的50块SC
        testSC50(){
            const test = new SuperChat(
                '碧诗',2,'这是一条测试SC','','','','',50,0,0,'#DBFFFD','#427D9E','#7DA4BD',
                'https://i0.hdslb.com/bfs/live/1aee2d5e9e8f03eed462a7b4bbfd0a7128bbc8b1.png',
                'https://i1.hdslb.com/bfs/face/3e60b20604b6fdc7d081eb6a1ec72aa47c5a3964.jpg'
            );
            this.transSuperChat(test);
        },
        testSC100(){
            const test = new SuperChat(
                '碧诗',2,'这是一条测试SC','','','','',100,0,0,'#FFF1C5','#E2B52B','#ECCF75',
                'https://i0.hdslb.com/bfs/live/1aee2d5e9e8f03eed462a7b4bbfd0a7128bbc8b1.png',
                'https://i1.hdslb.com/bfs/face/3e60b20604b6fdc7d081eb6a1ec72aa47c5a3964.jpg'
            );
            this.transSuperChat(test);
        },
        testSC500(){
            const test = new SuperChat(
                '碧诗',2,'这是一条测试SC','','','','',500,0,0,'#FFEAD2','#E09443','#E8AF79',
                'https://i0.hdslb.com/bfs/live/1aee2d5e9e8f03eed462a7b4bbfd0a7128bbc8b1.png',
                'https://i1.hdslb.com/bfs/face/3e60b20604b6fdc7d081eb6a1ec72aa47c5a3964.jpg'
            );
            this.transSuperChat(test);
        },
        testSC1000(){
            const test = new SuperChat(
                '碧诗',2,'这是一条测试SC','','','','',1000,0,0,'#FFE7E4','#E54D4D','#EE8B8B',
                'https://i0.hdslb.com/bfs/live/1aee2d5e9e8f03eed462a7b4bbfd0a7128bbc8b1.png',
                'https://i1.hdslb.com/bfs/face/3e60b20604b6fdc7d081eb6a1ec72aa47c5a3964.jpg'
            );
            this.transSuperChat(test);
        },
        testSC2000(){
            const test = new SuperChat(
                '碧诗',2,'这是一条测试SC','','','','',2000,0,0,'#FFD8D8','#AB1A32','#C86A7A',
                'https://i0.hdslb.com/bfs/live/1aee2d5e9e8f03eed462a7b4bbfd0a7128bbc8b1.png',
                'https://i1.hdslb.com/bfs/face/3e60b20604b6fdc7d081eb6a1ec72aa47c5a3964.jpg'
            );
            this.transSuperChat(test);
        },
        testDanmu(){
            const test = new Danmu('Yeuoly',40691233,'测试弹幕','','','','','');
            this.transDanmus([test]);    
        },
        testGift(){
            const test = new Gift('Yeuoly',40691233,'http://i2.hdslb.com/bfs/face/dc664955fedaa4527d794abad384019a0c63f488.jpg',
                1,'辣条',23300,233,false
            );
            this.transGift(test);
        },
        testGuard(){
            const test = new Guard(new User('Yeuoly',40691233,'https://i2.hdslb.com/bfs/face/dc664955fedaa4527d794abad384019a0c63f488.jpg',0,0,0),3,198000);
            this.transGuard(test);
        },
        saveRecords(){
            writeRecords();
        },
        clearStatistic(){
            clearStatistic();
        }
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