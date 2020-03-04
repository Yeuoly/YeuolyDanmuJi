<template>
    <div id="handle" class="danmu-dialog">
        <i class="el-icon-s-tools" 
           id="setting" 
           @click="handleSetting"
        ></i>        
        <div id="cover" ref="cover" :style="{ backgroundColor: backgroundColor }">
            <SuperChat :Danmu="super_chats[current_super_chat]" 
                       class="superchats"
                       :style="{ transform : `translateY( -${ sc_replacing ? '160' : '0' }px )` }"
            ></SuperChat>
            <DanmuGroup v-for="i in danmu_groups"
                        :text-color="text_color(i.id)"
                        :key="i.id"
                        :index="i.id"
                        :Danmus="i.value"
            ></DanmuGroup>
        </div>
        <el-dialog width="95%" 
                   title="设置" 
                   :visible.sync="dialog_open"
                   center
                   id="setting-dig"
        >
            <div class="block">
                <span class="demonstration">窗口透明度</span>
                <el-slider v-model="opacity" :format-tooltip="calcOpacity"></el-slider>
            </div>
            <div class="block">
                <span class="demonstration">底色：</span>
                <el-radio-group v-model="backgound_color">
                    <el-radio :label="0">白色</el-radio>
                    <el-radio :label="1">黑色</el-radio>
                </el-radio-group>
            </div>
            <span class="demonstration">
                温馨提示：透明度请以关闭设置窗口后的为准
            </span>
        </el-dialog>
    </div>
</template>

<script>
import DanmuGroup from '../components/items/DanmuGroup';
import SuperChatComponent from '../components/items/SuperChat';

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

//获取全局设置
import { global_settings , refreshSettings } from '../settings/global_settings';

//sc停留时间判定
import SCTimer from '../settings/super_chat_staying_time';

import { SuperChat } from '../class/Danmu';

//礼物欢迎语
let gift_pre_saying = '赠送了';

export default {
    name : 'DanmuDialog',
    components : { DanmuGroup , SuperChat : SuperChatComponent },
    data: () => ({
        danmu_groups : [],
        color_group : color_group,
        current_danmu_count : 0,
        super_chats : [ new SuperChat(
             '碧诗',2,'这是一条测试SC','','','','',30,0,0,'#EDF5FF','#2A60B2','#7497CD',
            'https://i0.hdslb.com/bfs/live/1aee2d5e9e8f03eed462a7b4bbfd0a7128bbc8b1.png',
            'https://i1.hdslb.com/bfs/face/3e60b20604b6fdc7d081eb6a1ec72aa47c5a3964.jpg'
        ) ],
        current_super_chat : 0,
        sc_cycling : false,
        dialog_open : false,
        opacity : 50,
        backgound_color : 1,
        danmu_size : 16,
        sc_replacing : true
    }),
    computed : {
        text_color(index){
            if(this.color_group.length > 0)
                return index => this.color_group[index %  this.color_group.length];
            else
                return '#ffffff';
        },
        backgroundColor(){
            return `rgba(${ this.backgound_color === 1 ? '0,0,0' : '255,255,255' },${ this.opacity / 100 })`;
        }
    },
    methods: {
        handleSetting(){
            this.dialog_open = !this.dialog_open;
        },
        calcOpacity(val){
            return val / 100;
        },
        refreshGlobalSettings(){
            refreshSettings();
        },
        replaceSCAnimation( cb ){
            //如果下一个和现在的相同，就没得动画，直接开始下一轮展示
            if(this.super_chats[this.current_super_chat] === this.super_chats[this.current_super_chat+1]){
                typeof cb === 'function' && cb();
                return;
            }
            //开始动画
            this.sc_replacing = true;
            typeof cb === 'function' && setTimeout( () => {
                cb();
                this.sc_replacing = false;
            },700);
        },
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
                    case 'trans-gift':
                        this.loadGift(msg);
                        break;
                    case 'clear':
                        this.clear();
                        break;
                    case 'setting-color':
                        this.color_group = msg;
                        break;
                    case 'refresh_settings':
                        this.refreshGlobalSettings();
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
                this.replaceSCAnimation();
                return;
            }else{
                /**
                 * 如果判断当前SC还有多的，就先运行动画，此时current未改变
                 * replaceSCAnimation会判断current与current+1是否相同
                 * 如果相同，不会出现动画，如果不相同，就会运行动画，然后再更改current
                 */
                this.replaceSCAnimation( () => {
                    this.current_super_chat++;
                });
                this.sc_cycling = true;
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
        loadGift(gift){
            if(gift.is_super){

            }else{
                //伪造假弹幕、真礼物，普通礼物就划过去好了，super礼物在上面处理，会停留
                const Danmu = {
                    users : {
                        uids : [ gift.user.uid ]
                    },
                    user : {
                        id : gift.user.id
                    },
                    message : `${gift_pre_saying}${gift.gift_num}个<img class="small-gift" src="${gift.gift_image}" />${gift.gift_name}`
                }
                this.danmu_groups.push({
                    value : [ Danmu ],
                    id : this.current_danmu_count++
                });
            }
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
                //得要是找到了而且开了折叠弹幕才折叠
                if(index !== -1 && global_settings['display_module']['auto_fold_repeat_danmu']){
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
        const clear = drag('#handle');
        //windows和mac的窗口拖动
        if(!drag.supported){
            document.querySelector('#handle').style['-webkit-app-region'] = 'drag';
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
        overflow: hidden;
        margin-top: 0;
    }

    .superchats{
        position: absolute;
        width: 100%;
        z-index: 100;
        margin-left: -8px;
        transition: all .4s;
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
    }
    #cover{
        background-color: rgba(255,255, 255, 0.5);
        height: 700px;
        width: 100%;
        scroll-behavior: smooth;
        overflow: hidden;
        padding-right: 9px;
        padding-left: 9px;
        margin-left: -9px;
    }
    #setting{
        position: absolute;
        right: 5px;
        top: 5px;
        color: white;
        z-index: 5;
        -webkit-app-region: no-drag;
    }
    #setting-dig{
        -webkit-app-region: no-drag;
    }
</style>