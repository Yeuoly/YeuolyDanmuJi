<template>
    <div>
        <el-container>
            <el-aside width="200px">
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
                <div id="drag_area"></div>
                <i id="close" class="controller el-icon-close" @click="closeProgress"></i>
                <i id="minimize" class="controller el-icon-minus" @click="minimizeProgress"></i>
            </el-header>
            <el-main>
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import Logger from '../components/items/Logger.vue';
import { DanmuTransBus } from '../events/evnetBus';
import INFO from '../class/Info';
const drag = require('electron-drag');
const { ipcRenderer : ipc } = require('electron');

export default {
    name : 'Index',
    components : { Logger },
    data : () => ({
        routes : [{
            name : '日志',
            icon : 'el-icon-location',
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
            }]
        },{
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
            subtitle : '一些杂七杂八的功能',
            children : [{
                name : '反馈',
                url : '/index/feedback'
            },{
                name : '恰饭',
                url : '/index/qiafan'
            }]
        }]
    }),
    methods: {
        closeProgress(){
            ipc.send('window-close');
        },
        minimizeProgress(){
            ipc.send('window-min');
        },
        mountChannel(){
            ipc.on('to-main', ( _sender, channel, info ) => {
                switch(channel){
                    case 'trans-info':
                        this.transInfo(info.block,info.info,info.color);
                        break;
                }
            });
        },
        transInfo(block,info,color){
            INFO.log(block,info,color);
        },
        router(url){
            if(url === this.$route.path)return;
            this.$router.push(url);
        }
    },
    mounted() {
        //linux等平台的窗口拖动
        const clear = drag('#drag_area');
        //windows和mac的窗口拖动
        if(!drag.supported){
            document.querySelector('#drag_area').style['-webkit-app-region'] = 'drag';
        }
    },
}
</script>

<style scoped>
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
        font-weight: 700
    }
    #close:hover{
        color: red;
    }
    #minimize:hover{
        color: white;
    }
    #close{
        position: absolute;
        top: 10px;
        right: 10px;
    }
    #minimize{
        position: absolute;
        top: 10px;
        right: 40px;
    }
    .title{
        color: black;
        font-family: '黑体';
    }

    .el-aside {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        overflow-y: none;
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
        left: 199px;
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
        left: 199px;
        right: 0;
        padding: 5px;
        /* background-color: rgb(30,30,30);  */
        border-radius: 0 0 10px 0;
    }
</style>