<template>
    <div>
        <el-container>
            <el-aside width="200px">
                <el-menu
                    class="el-menu-vertical-demo"
                    style="height:100%"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                >
                    <el-menu-item index="1" @click="$router.push('index/logo')">
                        <template slot=title>
                            <i class="el-icon-location"></i>
                            <span>日志</span>
                        </template>
                    </el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>设置</span>
                        </template>
                        <el-menu-item-group>
                            <template slot="title">基础设置</template>
                            <el-menu-item index="2-1">房间信息</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
        </el-container>
        <el-container>
            <el-header>
                <h1 class="title">{{ $route.meta.title }}</h1>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import Logger from '../components/items/Logger.vue';

export default {
    name : 'Index',
    components : { Logger }
}
</script>

<style scoped>
    .title{
        color: rgb(208,208,208);
    }
    .el-menu{
        overflow: hidden;
    }
    .el-aside {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        overflow-y: none;
    }
    .el-header{
        height: 80px !important;
        display: block;
        position: absolute;
        left: 199px;
        top: 0;
        right: 0;
        background-color: #545464; 
    }
    .el-main{
        display: block;
        position: absolute;
        top: 80px;
        bottom: 0px;
        left: 199px;
        right: 0;
        padding: 5px;
        background-color: rgb(94,92,105); 
    }
</style>