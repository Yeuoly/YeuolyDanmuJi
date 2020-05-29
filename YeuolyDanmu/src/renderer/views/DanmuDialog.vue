<template>
    <div style="height:100%">
        <div id="handle" class="danmu-dialog"  :style="{ transform : master_transform }">
            <div id="ctrl-area">
                <i class="el-icon-setting" 
                    @click="handleSettingDialog"
                    title="页面设置"
                ></i>        
                <i :class=" click_locked ? 'el-icon-lock' : 'el-icon-unlock'"
                    @click="handleClickLock"
                    @mouseenter="leaveMaster"
                    @mouseleave="enterMaster"
                    title="穿透锁"
                ></i>
            </div>
            <div id="cover" ref="cover" :style="{ backgroundColor: backgroundColor }">
                <SuperChat v-if="super_chats[current_super_chat]" :Danmu="super_chats[current_super_chat]" 
                        class="superchats"
                        :style="{ transform : `translateY( -${ sc_replacing ? '160' : '0' }px )` }"
                ></SuperChat>
                <DanmuGroup v-for="i in danmu_groups_virtual"
                            :text-color="screen_settings.text_used ? text_color(i.id) : '#fff'"
                            :uname-color="screen_settings.uanme_used ? text_color(i.id) : '#fff'"
                            :key="i.id"
                            :index="i.id"
                            :Danmus="i.value"
                            :font="screen_settings.font_family"
                            :type="i.type"
                            :clear="i.clear"
                            :hidder="screen_settings.danmu_hidder.on"
                            :hidder-time="screen_settings.danmu_hidder.interval"
                            @end="revVirualListStart"
                ></DanmuGroup>
            </div>
        </div>
        <el-dialog width="95%" 
                title="设置" 
                :visible.sync="dialog_open"
                center
                id="setting-dig"
        >
            <div class="block">
                <span class="demonstration">窗口透明度</span>
                <el-slider v-model.lazy="screen_settings.opacity" :format-tooltip="calcOpacity"></el-slider>
            </div>
            <div class="block">
                <span class="demonstration">底色：</span>
                <el-radio-group v-model.lazy="screen_settings.backgound_color">
                    <el-radio :label="0">白色</el-radio>
                    <el-radio :label="1">黑色</el-radio>
                </el-radio-group>
            </div>
            <p class="demonstration">
                温馨提示：透明度请以关闭设置窗口后的为准
            </p>
            <el-switch 
                v-model="screen_settings.uanme_used"
                active-text="将用户名与色组绑定"
                style="padding-bottom:5px"
            ></el-switch>
            <el-switch 
                v-model="screen_settings.text_used"
                active-text="将弹幕文本与色组绑定"
                style="padding-bottom:5px"
            ></el-switch>
            <p></p>
            <el-switch 
                v-model="screen_settings.show_live_info"
                active-text="显示直播状态"
                style="padding-bottom:5px"
            ></el-switch>
            <el-switch 
                v-model="screen_settings.danmu_hidder.on"
                active-text="开启弹幕淡出"
                style="padding-bottom:5px"
            ></el-switch>
            <el-input v-model.number="screen_settings.danmu_hidder.interval">
                <template slot="prepend">
                    弹幕淡出时间
                </template>
            </el-input>
            <p></p>
            <p class="demonstration">
                选择字体
            </p>
            <el-select v-model="screen_settings.font_family">
                <el-option
                    v-for="i in font_families"
                    :key="i.id"
                    :label="i.label"
                    :value="i.value"
                ></el-option>
            </el-select>
            <p></p>
            <el-button plain type="primary" @click="saveColorSettings">保存设置</el-button>
        </el-dialog>
        <div id="live-info" 
            :style="live_info_style" 
            v-show="screen_settings.show_live_info"
        >
            <el-row>
                <el-col :span="12">
                    人气值:{{live.popular}}
                </el-col>
                <el-col :span="12">
                    粉丝数:{{live.fans}}
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import DanmuGroup from '../components/items/DanmuGroup';
import SuperChatComponent from '../components/items/SuperChat';

const drag = require('electron-drag');
const win = require('electron').remote.getCurrentWindow();
const win_id = win.id;
require('electron').remote.getCurrentWindow().setAlwaysOnTop(true);
require('electron').ipcRenderer.send('danmu-mounted', win_id);
document.title = '弹幕窗口';

//初始化颜色信息
import Store from 'electron-store';
const store = new Store();
const color_group = store.get('color-group-using',[]);

//获取全局设置
import { global_settings , refreshSettings } from '../settings/global_settings';

//获取通讯类
import { DialogSocket } from '../modules/Channel';

//sc停留时间判定
import SCTimer from '../settings/super_chat_staying_time';

//SC类
import { SuperChat } from '../class/Danmu';

//屏幕设置
import Utils from '../modules/Utils';

const screen_settings_default = {
    uanme_used : true,
    text_used : false,
    opacity : 50,
    backgound_color : 1,
    sleeper : true,
    font_family : 'DanmuFont',
    show_live_info : true,
    danmu_hidder : {
        on : true,
        interval : 30
    },
};

const screen_settings = store.get('danmu-dialog|screen_settings',{});
//检查屏幕设置更新
Utils.updateOptions(screen_settings, screen_settings_default);

//休眠器
import { IntervalTimer } from '../class/Timer';

//获取可用字体
import { support_font } from '../class/FontController';

export default {
    name : 'DanmuDialog',
    components : { DanmuGroup , SuperChat : SuperChatComponent },
    data(){
        SuperChat(
                '碧诗',2,'这是一条测试SC','','','','',30,0,0,'#EDF5FF','#2A60B2','#7497CD',
                'https://i0.hdslb.com/bfs/live/1aee2d5e9e8f03eed462a7b4bbfd0a7128bbc8b1.png',
                'https://i1.hdslb.com/bfs/face/3e60b20604b6fdc7d081eb6a1ec72aa47c5a3964.jpg'
        ).then( r => {
            data.super_chats.push(r);
        });
        const data = {
            danmu_groups : [{ text : '什么？你问我是干嘛的，我就是个填充物，减少判断用的', event : {} }],
            list_start : 1,
            color_group : color_group,
            current_danmu_count : 1,
            super_chats : [],
            current_super_chat : 0,
            sc_cycling : false,
            dialog_open : false,
            screen_settings,
            danmu_size : 16,
            sc_replacing : true,
            hidding_dialog : false,
            sleep_timer : null,
            font_families : [{
                id : '114514',
                label : '默认字体',
                value : 'DanmuFont'
            },...support_font],
            click_locked : false,
            live : {
                fans : 0,
                popular : 0
            }
        };
        return data; 
    },
    computed : {
        text_color(index){
            if(this.color_group.length > 0)
                return index => this.color_group[index %  this.color_group.length];
            else
                return '#ffffff';
        },
        backgroundColor(){
            return `rgba(${ this.screen_settings.backgound_color === 1 ? 
            '0,0,0' : '255,255,255' },${ this.screen_settings.opacity / 100 })`;
        },
        master_transform(){
            return `translateX(${this.hidding_dialog ? 'calc(100% + 18px)' : '0'})`;
        },
        live_info_style(){
            return {
                fontFamily : this.screen_settings.font_family,
                transform : this.master_transform,
                color : '#fff'
            }
        },
        danmu_groups_virtual(){
            return this.danmu_groups.slice(this.list_start, this.danmu_groups.length);
        }
    },
    methods: {
        saveColorSettings(){
            store.set('danmu-dialog|screen_settings',this.screen_settings);
        },
        handleSettingDialog(){
            this.dialog_open = !this.dialog_open;
        },
        handleClickLock(boot){
            this.click_locked = !this.click_locked;
        },
        enterMaster(e){
            if(this.click_locked){
                win.setIgnoreMouseEvents(true,{ forward : true });
            }
        },
        leaveMaster(e){
            if(this.click_locked){
                win.setIgnoreMouseEvents(false,{ forward : false });
            }
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
            //用于接收所有传输到弹幕窗口的信息
            const socket = new DialogSocket(32862);
            socket.startServer('danmu', () => {
                //向主窗口发送成功消息
                socket.send(JSON.stringify({ 
                    channel : 'trans-info',
                    data : { block : 'DanmuDialog', info : '弹幕窗口通讯连接成功', color : 'green'}
                }));
            });
            socket.addListener( ev => {
                const data = JSON.parse(ev.data);
                switch(data['channel']){
                    case 'trans-danmu':
                        this.loadDanmu(data['data']);
                        break;
                    case 'trans-sc':
                        this.loadSuperChat(data['data']);
                        break;
                    case 'trans-gift':
                        this.loadGift(data['data']);
                        break;
                    case 'trans-guard':
                        this.loadGuard(data['data']);
                        break;
                    case 'trans-live-info':
                        this.refreshLiveInfo(data['data']);
                        break;
                    case 'clear':
                        this.clear();
                        break;
                    case 'setting-color':
                        this.color_group = data['data'];
                        break;
                    case 'refresh-settings':
                        this.refreshGlobalSettings();
                        break;
                    case 'refresh-danmuwindow':
                        this.initSleeper();
                        break;
                }
            })
        },
        //获取虚拟列表表头id
        //并清理内存，我也不知道我怎么写着写着就写成这鬼样子的
        revVirualListStart(id){
            delete this.danmu_groups[id - 1];
            this.list_start = id;
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
        appendDanmu(source,type){
            const self = this;
            const index = self.current_danmu_count++;
            const dom = {
                type : type,
                value : source,
                id : index,
                clear : false
            };
            self.danmu_groups.push(dom);
        },
        loadGift(gift){
            if(gift.is_super){

            }else{
                this.appendDanmu([gift],'gift');
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
        loadGuard(guard){
            this.appendDanmu([guard],'guard');
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
            let len = 0;
            const full_len = danmus.length;
            danmus.forEach( e => {
                let index = msg.indexOf(e.message);
                /**
                 * 解说一下这里的迷惑操作，preload是用来向目标数组push元素的
                 * 这里要等待头像全部加载完毕再向目标数组中push元素，而且如你所见，加载是异步的
                 */
                const avatar = new Image();
                if(index !== -1 && global_settings['display_module']['auto_fold_repeat_danmu']){
                    norepeat_danmus[index].users.faces.push({ guard : e.guard_type , src : e.user.face });
                    norepeat_danmus[index].user.id = '一般路过群众';
                }else{
                    e.users = { 
                        faces : [ { 
                            guard : e.guard_type , 
                            src : e.user.face
                        }]
                    };
                    norepeat_danmus.push(e);
                    msg.push(e.message);
                }
                //先初始化完弹幕对象，再加载头像，感觉要回调地狱了
                avatar.src = e.user.face;
                avatar.onload = () => {
                    if(++len === full_len){
                        this.appendDanmu(norepeat_danmus,'normal')
                    }
                }
            });
        },
        //更新实时信息
        refreshLiveInfo({ fans , popular }){
            fans && ( this.live.fans = fans );
            popular && ( this.live.popular = popular );
        },
        //因为一些很蛋疼的事情不能直接清
        clear(){
            const len = this.danmu_groups.length;
            for(let i = len - 1; i > 0; i--){
                if(this.danmu_groups[i] === undefined){
                    return;
                }
                this.danmu_groups[i].clear = true;
            }
        },
    },
    mounted() {
        //linux等平台的窗口拖动
        const clear = drag('#handle');
        //windows和mac的窗口拖动
        if(!drag.supported){
            document.querySelector('#handle').style['-webkit-app-region'] = 'drag';
        }
        this.setupRevMsg();
        //重置一下窗口穿透，开发者模式下不重置会很蛋疼
        win.setIgnoreMouseEvents(false);
    },
}
</script>

<style>
    body{
        overflow: hidden;
        margin-top: 0;
        padding-right: 0 !important;
    }

    #app{
        height: 750px;
    }

    .superchats{
        position: absolute;
        width: calc(100% + 16px);
        z-index: 1;
        margin-left: -8px;
        transition: all .4s;
    }

    .danmu-dialog{
        width: 100%;
        margin: 0;
        padding: 0;
        border: 0;
        height: calc(100% - 40px);
        transition: all ease-in .5s;
    }
    #cover{
        height: 750px;
        width: 100%;
        scroll-behavior: smooth;
        overflow: hidden;
        padding-left: 9px;
        padding-right: 9px;
        margin-left: -9px;
    }
    #app-cover{
        z-index: 3;
        position: fixed;
        width: 100%;
        height: 100%;
    }
    #ctrl-area{
        position: absolute;
        right: -5px;
        top: 5px;
        z-index: 5;
        -webkit-app-region: no-drag;
        width: 20px;
    }
    #ctrl-area > * {
        color: white;
    }
    #setting-dig{
        -webkit-app-region: no-drag;
    }
    #live-info{
        display: block;
        height: 20px;
        line-height: 1;
        font-weight: 600
    }
</style>