<template>
    <div id="handle" class="danmu-dialog">
        <div id="cover" ref="cover">
            <SuperChat v-if="current_super_chat > -1" :Danmu="super_chats[current_super_chat]" class="superchats"></SuperChat>
            <DanmuGroup v-for="i in danmu_groups"
                        :text-color="text_color(i.id)"
                        :key="i.id"
                        :index="i.id"
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

//sc停留时间判定
import SCTimer from '../settings/super_chat_staying_time';

export default {
    name : 'DanmuDialog',
    components : { DanmuGroup , SuperChat },
    data: () => ({
        danmu_groups : [],
        color_group : color_group,
        current_danmu_count : 0,
        super_chats : [],
        current_super_chat : -1,
        sc_cycling : false
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
        replaceCurrentSuperChat(){
            if(this.current_super_chat === this.super_chats.length - 1){
                this.sc_cycling = false;
                return;
            }else{
                this.sc_cycling = true;
                this.current_super_chat++;
                const interval = SCTimer.getEach() * 1000;
                setTimeout(() => {
                    const current = this.super_chats[this.current_super_chat];
                    if(current.last_tims > 0){
                        this.spendSC(current);
                    }
                    //下一次展示更换sc
                    this.replaceCurrentSuperChat();
                },interval);
            }
        },
        //消费一次sc？感觉听着好奇怪x
        spendSC(src){
            src.last_tims--;
            this.super_chats.push(src);
        },
        loadSuperChat(sc){
            //获取sc轮询次数
            sc.last_tims = SCTimer.getTimes(sc.price);
            this.spendSC(sc);
            if(!this.sc_cycling){
                this.replaceCurrentSuperChat();
            }
        },
        loadDanmu(danmus){
            //要考虑处理一下重复弹幕，肝，它痛了起来
            //开始处理叭
            /**
             * 写一下注释，对一个弹幕组的弹幕进行分析，把相同弹幕都抽出来放到同一个弹幕中
             * 给这个弹幕添加属性：uids，表示发这个弹幕的所有用户
             * 然后修改这个弹幕名称为[一般路过群众]
             */
            const msg = [];
            const norepeat_danmus = [];
            danmus.forEach( e => {
                let index = msg.indexOf(e.message);
                if(index !== -1){
                    norepeat_danmus[index].users.uids.push(e.user.uid);
                    norepeat_danmus[index].user.id = '一般路过群众';
                }else{
                    e.users = {
                        uids : [ e.user.uid ]
                    }
                    norepeat_danmus.push(e);
                    msg.push(e.message);
                }
            })
            this.danmu_groups.push({
                value : norepeat_danmus,
                id : this.current_danmu_count++
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
        //     }s
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