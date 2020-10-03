<template>
    <div>
        <el-container>
            <el-aside width="150px" style="user-select: none">
                <el-menu
                    style="height:100%"
                    background-color="#3B3F52"
                    text-color="#fff"
                >
                    <div v-for="(i, key) in routes"
                        :key="key"
                    >
                        <el-menu-item :index="key.toString()" 
                            v-if="!i.children"
                            @click="router(i.url)"
                        >
                            <template slot=title>
                                <i :class="i.icon"></i>
                                <span>{{i.name}}</span>
                            </template>
                        </el-menu-item>
                        <el-submenu v-else 
                            :index="key.toString()"
                        >
                            <template slot=title>
                                <i :class="i.icon"></i>
                                <span>{{i.name}}</span>
                            </template>
                            <el-menu-item-group>
                                <template slot="title">{{i.subtitle}}</template>    
                                <el-menu-item v-for="( t, key_t ) in i.children"
                                    :key="key_t"
                                    :index="`${key}-${key_t}`"
                                    @click="router(t.url)"
                                >
                                    {{t.name}}
                                </el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                    </div>
                </el-menu>
            </el-aside>
        </el-container>
        <el-container>
            <el-header id="header">
                <h1 class="title">{{ $route.meta.title }}</h1>
                <div id="drag_area" @mousedown="windowMove(true)" @mouseup="windowMove(false)"></div>
                <i id="close" class="controller el-icon-close" @click="closeProgress"></i>
                <i id="minimize" class="controller el-icon-minus" @click="minimizeProgress"></i>
                <!-- <div id="index-user">
                    <span id="index-name">{{user.name}}</span>
                    <div id="index-face" :style="{ backgroundImage : `url(${user.face})` }"></div>
                </div> -->
            </el-header>
            <el-main>
                <div class="px1 pb3" style="overflow:auto;height:500px">
                    <keep-alive>
                        <router-view></router-view>
                    </keep-alive>
                    <div v-if="$route.name === 'index'" id="index-logo">
                        <img :src="meta.logo" id="index-icon" />
                        <div class="pl3" id="icon-text">YeuolyOrg</div>
                    </div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import { DanmuTransBus, OrdinaryEventBus } from '../events/evnetBus';
import { DialogChannel } from '../modules/Channel';
import Logger from '../components/items/Logger.vue';
import INFO from '../modules/Info';
import { getInitialDanmuSize } from '../../main/resize';
import { MessageBox } from 'element-ui';

//初始化礼物汇率等
import { cny_exchangerate_controller } from '../data/settings';
import GiftStation from '../modules/GiftStation';
GiftStation.getGiftConfig();
cny_exchangerate_controller.init();

import { getStorage, modifyStorage } from '../modules/Store';

//初始化插件
import '../boot/plugin';

//初始化窗口通讯
const messager = new DialogChannel(0);
messager.startServer(() => {
    INFO.log('Index','主窗口通讯连接成功','green');
});
export const sender = (channel, data) => {
    messager.send({channel, data});
};
export const addListener = handler => {
    messager.addListener(handler);
}
addListener( ev => {
    switch(ev['channel']){
        case 'trans-info':
            INFO.log(ev['data']['block'],ev['data']['info'],ev['data']['color']);
            break;
    }
});

//import Account from '../data/user';

const logo = require('../assets/logo.png');
const { ipcRenderer : ipc } = require('electron');

import { launchStatistics, getLastVersion } from '../modules/statistics';

export default {
    name : 'Index',
    components : { Logger },
    data : () => ({
        routes : [{
            name : '主页',
            icon : 'el-icon-video-play',
            url : '/'
        },{
            name : '日志',
            icon : 'yeuoly-icon-command',
            url : '/index/log'
        },{
            name : '任务',
            icon : 'el-icon-document',
            url : '/index/task'
        },{
            name : '设置',
            icon : 'el-icon-setting',
            subtitle : '基础设置',
            children : [{
                name : '房间设置',
                url : '/index/room-settings'
            },{
                name : '颜色设置',
                url : '/index/color-settings'
            },{
                name : '高级设置',
                url : '/index/advance-settings'
            }/*,{
                name : '自定义弹幕',
                url : '/index/custom-danmu'
            }*/]
        },/*{
            name : '账户',
            icon : 'el-icon-user',
            subtitle : '账号管理',
            children : [{
                name : '登录YS账号',
                url : '/index/ys-login'
            }]
        },*/{
            name : '记录',
            icon : 'el-icon-reading',
            subtitle : '舰长、SC、礼物等记录',
            children : [{
                name : '礼物记录',
                url : '/index/records-gift-window'
            },{
                name : 'SC记录',
                url : '/index/records-sc-window'
            },{
                name : '舰长记录',
                url : '/index/records-guard-window'
            },{
                name : '历史',
                url : '/index/records-reader'
            }]
        },{
            name : '统计',
            icon : 'el-icon-pie-chart',
            subtitle : '统计模块',
            children : [{
                name : '统计总览',
                url : '/index/statistic'
            },{
                name : '排名',
                url : '/index/dd-rank'
            }]
        },{
            name : '插件',
            icon : 'el-icon-paperclip',
            subtitle : '插件模块',
            children : [{
                name : '插件列表',
                url : '/index/plugins-list'
            }]
        },{
            name : '更多',
            icon : 'el-icon-more',
            subtitle : '一些杂七杂八的',
            children : [{
                name : '反馈',
                url : '/index/feedback'
            },{
                name : '缓存管理',
                url : '/index/cache-manager'
            }]
        }],
        user : {
            name : '未登录',
            face : 'http://i0.hdslb.com/bfs/album/6389ef2f437a4b00d0dc863b44f4084bf6b4165a.jpg'
        },
        meta : {
            logo
        },
        quit_dialog_visible : false
    }),
    methods: {
        windowMove(state){
            messager.setWindowMoveState(state);
        },
        closeProgress(){
            let choice = 0;
            const auto_quit = getStorage('auto-quit', '00');
            const confrim = then => {
                MessageBox.confirm('是否记住选择？可以在缓存管理中重新设置', '提示').then(() => {
                    modifyStorage('auto-quit', '1' + choice);
                }).catch(() => {
                    modifyStorage('auto-quit', '0' + choice);
                }).finally(() => {
                    setTimeout(then, 100);
                });
            }
            if(auto_quit[0] === '1'){
                auto_quit[1] === '0' ? this.minimizeProgress() : ipc.send('window-close');
            }else{
                MessageBox.confirm('您确定要退出吗？','提示',
                    { 
                        confirmButtonText : '退出', 
                        cancelButtonText : '最小化',
                    }
                ).then(() => {
                    choice = 1;
                    confrim(() => ipc.send('window-close'));
                }).catch(() => {
                    choice = 0;
                    confrim(() => ipc.send('window-min'));
                });
            } 
        },
        minimizeProgress(){
            ipc.send('window-min');
        },
        router(url){
            if(url === this.$route.path)return;
            this.$router.push(url);
        },
        setUserInfo(){
            Account.master.get((id, uid, face) => {
                this.user.name = id;
                this.user.face = face;
            });
        },
        // initAccount(){
        //     OrdinaryEventBus.$on('master-login-succeed',this.setUserInfo);
        //     Account.init();
        // }
    },
    async mounted() {
        //启动弹幕窗口
        const size = getInitialDanmuSize();
        const win = this.$Win.openWin({
            width: size.width,
            height: size.height,
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
        //统计
        launchStatistics();
        //获取版本列表，检查更新
        const data = await getLastVersion();
        if(data){
            const versions = data['data']['data'];
            const current = 'v1.0.6.3';
            if(versions[0].version !== current){
                const itrdt = JSON.parse(versions[0].introduction);
                INFO.warning('Statistics', `已经有新版本了哟，最新更新内容：${itrdt['introduction']}，更新日期：${itrdt['date']}，下载地址：http://downloads.srmxy.cn`);
            }else{
                INFO.log('Statistics','您的版本已经是最新版本了哟','green');
            }
        }
    },
}
</script>

<style scoped>
    #index-logo{
        width: 80%;
        margin: 0 auto;
        overflow: hidden;
        margin-top: 20vh;
        color: #00B9FF;
        font-family: 'SourceCodePro';
        font-size: 60px;
        line-height: 2.5;
        user-select: none;
    }
    #index-icon{
        height: 150px;
        float: left;
        padding-right: 30px;
        padding-left: 50px;
    }
    #icon-text{
        height: 150px;
    }
    #index-user{
        position: absolute;
        right: 75px;
        top: 23px;
        user-select: none;
    }
    #index-face{
        width: 25px;
        /* z-index: 0; */
        height: 25px;
        /* position: absolute; */
        border-radius: 50%;
        /* top: 35px; */
        /* right: 10px; */
        float: right;
        background-size: cover;
        background-position: center center;
    }
    #index-name{
        /* position: absolute; */
        /* top: 37px; */
        /* right: 40px; */
        height: 35px;
        color: grey;
        /* line-height: 1; */
        font-size: 16px;
        font-family: '黑体';
        /* line-height: 1; */
        text-align: right;
        float: right;
        padding-left: 5px;
        margin-top: 2px;
    }

    .el-main > * {
        background-color: transparent;
    }
    #drag_area{
        position: absolute;
        color: transparent;
        height: 70px;
        right: 80px;
        left: 0;
        top: 0;
        bottom: 70px;
    }
    .controller{
        background-color: transparent;
        font-size: 20px;
        color: gray;
        width: 20px;
        height: 20px;
        transition: all .1s;
        font-weight: 700;
        border-radius: 50%;
    }
    .controller:hover{
        background-color: rgb(230,230,230);
    }
    #close{
        position: absolute;
        top: 25px;
        right: 10px;
    }
    #minimize{
        position: absolute;
        top: 25px;
        right: 40px;
    }
    .title{
        color: grey;
        font-family: '黑体';
    }

    .el-aside {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        overflow-x: hidden;
        /* background-color: rgb(37,37,38); */
        border-radius: 10px 0 0 10px;
    }

    .el-aside::-webkit-scrollbar{
        display: none;
    }

    .el-header{
        height: 70px !important;
        display: block;
        position: absolute;
        left: 149px;
        top: 0;
        right: 0;
        background-color: rgb(249,251,252);
        border-radius: 0 10px 0 0;
    }
    .el-main{
        display: block;
        position: absolute;
        background-color: white;
        top: 70px;
        bottom: 0px;
        left: 149px;
        right: 0;
        padding: 5px;
        /* background-color: rgb(30,30,30);  */
        border-radius: 0 0 10px 0;
    }
</style>