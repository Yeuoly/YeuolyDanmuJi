<template>
    <div id="handle" class="danmu-dialog">
        <div id="cover" ref="cover">
             <Danmu v-for="(i, key) in danmus" :key="key" :Danmu="i" :parent="$refs.cover"></Danmu>
        </div>
    </div>
</template>

<script>
import Danmu from '../components/items/Danmu';

const drag = require('electron-drag');
const ipc = require('electron').ipcRenderer;
const win_id = require('electron').remote.getCurrentWindow().id;
require('electron').remote.getCurrentWindow().setAlwaysOnTop(true);

//十万的时候清理一下，100000个在沙月的直播间大概要5 * 1000分钟，完全够了
//就算弹幕速度快5倍也能用1000分钟，一天就24 * 60分钟
const danmu_max_len = 100000;
const delete_time = 5;

export default {
    name : 'DanmuDialog',
    components : { Danmu },
    data: () => ({
        danmus : [],
    }),
    methods: {
        //装载弹幕接收钩子
        setupRevDanmu(){
            //由于这个窗口是在渲染进程中进行的，主进程不能直接获取窗口ID，所以在窗口挂载时向主进程发送窗口ID
            ipc.send('danmu-mounted',win_id);
            //用于接收所有传输到弹幕窗口的信息
            ipc.on('to-danmu', ( sender, channel, msg ) => {
                if(channel === 'trans-danmu'){
                    //传过来的弹幕都是数组
                    msg.forEach( e => { 
                        this.danmus.push(e);
                    });
                    if(this.danmus.length > danmu_max_len){
                        this.clear();
                    }
                }else if(channel === 'clear'){
                    this.clear()
                }
            });
            //向主窗口发送成功消息
            ipc.send('to-main','trans-info',
                { block : '[DanmuDialog]', info : '弹幕窗口连接成功', color : 'green'} );
        },
        //当弹幕太多了的时候清除顶部的几个
        clear(){
                this.danmus = []
        }
    },
    mounted() {
        //linux等平台的窗口拖动
        const clear = drag('#cover');
        //windows和mac的窗口拖动
        if(!drag.supported){
            document.querySelector('#cover').style['-webkit-app-region'] = 'drag';
        }
        this.setupRevDanmu();
    },
}
</script>

<style>
    @font-face {
        font-family: 'DanmuFont';
        src: url('../assets/SuCaiJiShiKangKangTi-2.ttf');
    }
    .danmu-dialog{
        height: calc(100%-10px);
        width: 100%;
        margin: 0;
        padding: 0;
        border: 0;
    }
    #cover{
        background-color: rgba(255,255, 255, 0.5);
        height: 680px;
        width: 100%;
        overflow: hidden;
        scroll-behavior: smooth;
    }
</style>