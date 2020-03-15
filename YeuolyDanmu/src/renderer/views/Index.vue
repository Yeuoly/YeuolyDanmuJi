<template>
    <div>
        <el-container>
            <el-aside width="200px">
                <el-menu
                    class="el-menu-vertical-demo"
                    style="height:100%"
                    background-color="#252526"
                    active-background-color="#2A2D2E"
                    text-color="#fff"
                >
                    <el-menu-item index="1" @click="$router.push('/index/log')">
                        <template slot=title>
                            <i class="el-icon-location"></i>
                            <span>日志</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="2" @click="$router.push('/index/task')">
                        <template slot=title>
                            <i class="el-icon-document"></i>
                            <span>任务</span>
                        </template>
                    </el-menu-item>
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>设置</span>
                        </template>
                        <el-menu-item-group>
                            <template slot="title">基础设置</template>
                            <el-menu-item index="2-1" @click="$router.push('/index/room-settings')">
                                房间信息
                            </el-menu-item>
                            <el-menu-item index="2-2" @click="$router.push('/index/color-settings')">
                                颜色设置
                            </el-menu-item>
                            <template slot="title">高级设置</template>
                            <el-menu-item index="2-3" @click="$router.push('/index/advance-settings')">
                                高级设置
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-reading"></i>
                            <span>记录</span>
                        </template>
                        <el-menu-item-group>
                            <template slot="title">SC、礼物记录</template>
                            <el-menu-item index="4-1" @click="$router.push('/index/records-gift-window')">
                                礼物记录
                            </el-menu-item>
                            <el-menu-item index="4-2" @click="$router.push('/index/records-sc-window')">
                                SC记录
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-pie-chart"></i>
                            <span>统计</span>
                        </template>
                        <el-menu-item-group>
                            <template slot="title">统计模块</template>
                            <el-menu-item index="5-1" @click="$router.push('/index/statistic')">
                                数据统计
                            </el-menu-item>
                            <el-menu-item index="5-2" @click="$router.push('/index/dd-rank')">
                                排名
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
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
        color: rgb(208,208,208);
    }
    .el-menu{
        overflow: hidden;
    }
    .el-menu-item .is-active:hover{
        background-color: red !important;
    }
    .el-aside {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        overflow-y: none;
        /* background-color: rgb(37,37,38); */
    }
    .el-header{
        height: 70px !important;
        display: block;
        position: absolute;
        left: 199px;
        top: 0;
        right: 0;
        background-color: rgb(50,50,51);
    }
    .el-main{
        display: block;
        position: absolute;
        top: 70px;
        bottom: 0px;
        left: 199px;
        right: 0;
        padding: 5px;
        /* background-color: rgb(30,30,30);  */
    }
</style>