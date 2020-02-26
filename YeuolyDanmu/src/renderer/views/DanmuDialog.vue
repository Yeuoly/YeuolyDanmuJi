<template>
    <div id="handle" class="danmu-dialog">
        <div id="cover" ref="cover">
            <SuperChat v-if="current_super_chat > -1" :Danmu="super_chats[current_super_chat]" class="superchats"></SuperChat>
            <DanmuGroup v-for="(i, key) in danmu_groups"
                        :text-color="text_color(key)"
                        :key="i.id"
                        :index="current_danmu_count + key"
                        :Danmus="i.value"
            ></DanmuGroup>
        </div>
    </div>
</template>

<script>
import DanmuGroup from '../components/items/DanmuGroup';
import SuperChat from '../components/items/SuperChat';

const drag = require('electron-drag');
const ipc = require('electron').ipcRenderer;
const win_id = require('electron').remote.getCurrentWindow().id;
require('electron').remote.getCurrentWindow().setAlwaysOnTop(true);

//十万的时候清理一下，100000个在沙月的直播间大概要5 * 1000分钟，完全够了
//就算弹幕速度快5倍也能用1000分钟，一天就24 * 60分钟
const danmu_max_len = 50;
const delete_time = 5;

//初始化颜色信息
import Store from 'electron-store';
const store = new Store();
const color_group = store.get('color-group-using',[]);
//初始化过滤设置
const filter = store.get('settings-filter',{ lv : 0 , message : []});

export default {
    name : 'DanmuDialog',
    components : { DanmuGroup , SuperChat },
    data: () => ({
        danmu_groups : [],
        color_group : color_group,
        current_danmu_count : 0,
        super_chats : [],
        current_super_chat : -1
    }),
    computed : {
        text_color(index){
            if(this.color_group.length > 0)
                return index => this.color_group[index %  this.color_group.length];
            else
                return '#ffffff';
        }
    },
    methods: {
        //装载弹幕接收钩子
        setupRevMsg(){
            //由于这个窗口是在渲染进程中进行的，主进程不能直接获取窗口ID，所以在窗口挂载时向主进程发送窗口ID
            ipc.send('danmu-mounted',win_id);
            //用于接收所有传输到弹幕窗口的信息
            ipc.on('to-danmu', ( sender, channel, msg ) => {
                switch(channel){
                    case 'trans-danmu':
                        this.loadDanmu(msg);
                        break;
                    case 'trans-sc':
                        this.loadSuperChat(msg);
                        this.current_super_chat++;
                        break;
                    case 'clear':
                        this.clear();
                        break;
                    case 'setting-color':
                        this.color_group = msg;
                        break;
                }
            });
            //向主窗口发送成功消息
            ipc.send('to-main','trans-info',
                { block : '[DanmuDialog]', info : '弹幕窗口连接成功', color : 'green'} );
        },
        loadSuperChat(scs){
            this.super_chats = [...this.super_chats,...scs];  
        },
        loadDanmu(danmus){
            this.current_danmu_count++;
            this.danmu_groups.push({
                value : danmus,
                id : Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36)
            });
            if(this.danmu_groups.length > danmu_max_len){
                this.clear(20);
            }
        },
        //当弹幕太多了的时候清除顶部的几个
        clear(end){
            if(end){
                this.danmu_groups.splice(0,this.danmu_groups.length - end);
            }else{
                this.danmu_groups = [];
            }
        },
        // onFast(flag){
        //     if(this.fast_flag !== flag){
        //         this.fast_flag = flag;
        //         this.$refs.cover.style['scroll-behavior'] =  flag ? 'initial' : 'smooth';
        //     }
        // },
        // moveScroll(){
        //     //如果弹幕太多了就动快点，弹幕少就慢慢动，救命啊这里卡爆了
        //     if(this.$refs.cover.scrollTop + 100 < this.$refs.cover.scrollHeight){
        //         this.$refs.cover.scrollTop = this.$refs.cover.scrollHeight;
        //     }
        //     else{
        //         this.$refs.cover.scrollTop += 30;
        //     }
        // }
    },
    mounted() {
        //linux等平台的窗口拖动
        const clear = drag('#cover');
        //windows和mac的窗口拖动
        if(!drag.supported){
            document.querySelector('#cover').style['-webkit-app-region'] = 'drag';
        }
        this.setupRevMsg();
        //将滑条固定在最底部
        // this.move_interval = setInterval(() => {
        //     this.moveScroll();
        // },100);        
    },
}
</script>

<style>
    body{
        margin: 0;
        overflow: hidden;
    }

    .superchats{
        position: absolute;
        width: 100%;
        z-index: 100;
    }

    @font-face {
        font-family: 'DanmuFont';
        src: url('../assets/SuCaiJiShiKangKangTi-2.ttf');
    }
    .danmu-dialog{
        width: 100%;
        margin: 0;
        padding: 0;
        border: 0;
        transition: height .2s;
    }
    #cover{
        background-color: rgba(255,255, 255, 0.5);
        height: 700px;
        width: 100%;
        scroll-behavior: smooth;
        overflow: hidden;
    }
</style>