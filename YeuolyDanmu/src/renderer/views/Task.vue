<template>
    <div>
        <el-row>
            <el-col :span="4">
                <el-button 
                    type="primary" 
                    plain 
                    @click="startDanmuLoader" 
                    :disabled="started" 
                    :loading="starting"
                >
                    启动弹幕姬
                </el-button>
            </el-col>
            <el-col :span="4">
                <el-button 
                    type="danger" 
                    plain   
                    @click="closeDanmuLoader" 
                    :disabled="!started"
                    :loading="closing"
                >
                    关闭弹幕姬
                </el-button>
            </el-col>
            <el-col :span="4">
                <el-button 
                    type="info" 
                    plain   
                    @click="clearDanmu" 
                >
                    清空弹幕姬
                </el-button>
            </el-col>
            <el-col :span="4">
                <el-button 
                    type="info" 
                    plain   
                    @click="testSC" 
                >
                    测试SC
                </el-button>
            </el-col>
            <el-col :span="4">
                <el-button 
                    type="info" 
                    plain   
                    @click="testDanmu" 
                >
                    测试弹幕
                </el-button>
            </el-col>
            <el-col :span="4">
                <el-button 
                    type="info" 
                    plain   
                    @click="testGift" 
                >
                    测试辣条
                </el-button>
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
import { SuperChat , Gift } from '../class/Danmu';

import { addGift, addLog, addSC } from '../data/logs';
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
        gift_dialog_id : 0
    }),
    methods: {
        //传输普通弹幕
        transDanmus(danmus){
            //向弹幕窗口发送新弹幕
            ipc.send('to-danmu','trans-danmu',this.danmusFilter(danmus));
            //入库保存
            //但是叭。。这个弹幕量太大的时候我还没想好怎么处理数据。。所以弹幕先不入库了。。
        },
        //传输sc
        transSuperChat(sc){
            ipc.send('to-danmu','trans-sc',sc);
            addSC(sc);
        },
        transGift(gift){
            //这里最后需要做一点调整，把礼物全部传输到一个单独显示礼物的地方
            ipc.send('to-danmu','trans-gift',gift);
            addGift(gift);
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
            //首先打开弹幕窗口，初始化窗口信息
            if(!this.danmu_dialog_flag){
                this.openDanmuDialog();
            }
            //禁止再次启动
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
            },
            this.DanmuLoader.setRoomID(room_id);
            this.DanmuLoader.startLoader(() => {
                //成功后的回调
                OrdinaryEventBus.$emit('start-loader');
                this.danmu_dialog_flag = true;
                this.starting = false;
                this.started = true;
            });
        },
        closeDanmuLoader(){
            this.closing = true;
            this.DanmuLoader.closeLoader(() => {
                this.closing = false;
                this.started = false;
                this.starting = false;
            });
        },
        clearDanmu(){
            ipc.send('to-danmu','clear');
        },
        async openDanmuDialog(){
            const win = await this.$Win.openWin({
                width: 300,
                height: 700,
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
                }
            });
        },
        //伪造一个虚假的SC
        testSC(){
            const test = new SuperChat(
                '碧诗',2,'这是一条测试SC','','','','',30,0,0,'#EDF5FF','#2A60B2','#7497CD',
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
            const test = new Gift('Yeuoly',40691233,'',1,'辣条',23300,233,'https://s1.hdslb.com/bfs/live/d57afb7c5596359970eb430655c6aef501a268ab.png',false);
            this.transGift(test);
        }
    },
    mounted() {
        
    },
    beforeDestroy() {
        ipc.send('window-close-danmu');
        this.danmu_dialog_flag = false;
    },
}
</script>

<style>

</style>