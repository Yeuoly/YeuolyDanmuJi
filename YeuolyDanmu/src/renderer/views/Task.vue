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
        </el-row>
    </div>
</template>

<script>
import Loader from '../class/DanmuLoader';
import { DanmuTransBus } from '../events/evnetBus';

const ipc = require('electron').ipcRenderer;

export default {
    name : 'Task',
    data : () => ({
        DanmuLoader : new Loader(1534600),
        started : false,
        starting : false,
        closing :false,
        socket_sender : null,
        danmu_dialog_flag : false
    }),
    methods: {
        //传输普通弹幕
        transDanmus(danmus){
            //向弹幕窗口发送新弹幕
            ipc.send('to-danmu','trans-danmu',danmus);
        },
        //传输sc
        transSuperChat(scs){
            ipc.send('to-danmu','trans-sc',scs);
        },
        //将原始弹幕分类，原始弹幕分为sc和普通弹幕
        classifyDanmus(source){
            let sc = [];
            let nr = [];
            source.forEach(e => {
                if(e.type === 'normal'){
                    nr.push(e);
                }else if(e.type === 'super_chat'){
                    sc.push(e);
                }
            });
            sc.length > 0 ? this.transSuperChat(sc) : null;
            nr.length > 0 ? this.transDanmus(this.danmusFilter(nr)) : null;
        },
        //过滤弹幕
        danmusFilter(danmus){
            return danmus;
        },
        //启动弹幕加载
        startDanmuLoader(){
            //首先打开弹幕窗口，初始化窗口信息
            if(!this.danmu_dialog_flag){
                this.openDanmuDialog();
            }
            //禁止再次启动
            this.starting = true;
            const room_id = this.$store.getters.getRoomID;
            //把弹幕分裂钩子挂到Loader上
            this.DanmuLoader.onadd = danmus => {
                this.classifyDanmus(danmus);
            }
            this.DanmuLoader.setRoomID(room_id);
            this.DanmuLoader.startLoader(() => {
                //成功后的回调
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
        openDanmuDialog(){
            const win = this.$Win.openWin({
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
    .el-button{
        background-color: transparent !important;
        border-color: white !important;
    }
</style>