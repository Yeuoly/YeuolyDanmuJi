<template>
    <div>
        <el-row>
            <el-col :span="20">
                <el-tabs tab-position="left">
                    <el-tab-pane label="弹幕">
                        <el-input v-model="searcher.danmu_key" class="pb2 pr2" style="width:98%">
                            <template slot="prepend">
                                查找
                            </template>
                        </el-input>
                        <virtual-list :data="filted_danmu" :height="450" :item-height="20" style="width:98%">
                            <template slot="inner" scope="channel">
                                {{channel.data.id}}:{{channel.data.message}}
                            </template>
                        </virtual-list>
                    </el-tab-pane>
                    <el-tab-pane label="礼物">
                        <el-input v-model="searcher.gift_key" class="pb2" style="width:98%">
                            <template slot="prepend">
                                查找
                            </template>
                        </el-input>
                        <virtual-list :data="filted_gift" :height="450" :item-height="20" style="width:98%">
                            <template slot="inner" scope="channel">
                                {{channel.data.user.id}}[{{channel.data.user.uid}}]:赠送了{{channel.data.gift_num}}个{{channel.data.gift_name}}
                            </template>
                        </virtual-list>
                    </el-tab-pane>
                    <el-tab-pane label="日志">
                        <el-input v-model="searcher.log_key" class="pb2" style="width:98%">
                            <template slot="prepend">
                                查找
                            </template>
                        </el-input>
                        <virtual-list :data="filted_log" :height="450" :item-height="40" style="width:98%">
                            <template slot="inner" scope="channel">
                                {{channel}}
                            </template>
                        </virtual-list>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col :span="4">
                <span class="menu-font">选取要读取的日志文件</span>
                <div id="logs-menu">
                    <div class="log pb1" v-for="(log, key) in files.logs" :key="key" @click="loadFile(log, 'log')">
                        {{log.split('.')[0]}}
                    </div>
                </div>
                <div id="records-reader-daily-menu"></div>
                <span class="menu-font">选取要读取的记录文件</span>
                <div id="logs-menu">
                    <div class="log pb1" v-for="(daily, key) in files.daily" :key="key" @click="loadFile(daily, 'daily')">
                        {{daily.split('.')[0]}}
                    </div>
                </div>
                <div id="records-reader-daily-menu"></div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { global_settings } from '../settings/global_settings';
import pather from 'path';
import fs from 'fs';
import Info from '../class/Info';

import VirtualList from '../components/common/VirtualList';

export default {
    name : 'RecordsReader',
    components : { VirtualList },
    data : () => ({
        files : {
            logs : [],
            daily : []
        },
        records : {
            danmu : [],
            gift : [],
            sc : [],
            guard : [],
            logs : []
        },
        searcher : {
            gift_key : '',
            danmu_key : '',
            log_key : ''
        },
    }),
    computed: {
        filted_gift(){
            return this.records.gift.filter( e => this.searcher.gift_key === '' || new RegExp(this.searcher.gift_key).test(JSON.stringify(e)));
        },
        filted_danmu(){
            return this.records.danmu.filter( e => this.searcher.danmu_key === '' || new RegExp(this.searcher.danmu_key).test(JSON.stringify(e)));
        },
        filted_log(){
            return this.records.logs.filter( e => this.searcher.log_key === '' || new RegExp(this.searcher.log_key).test(JSON.stringify(e)));
        }
    },
    methods : {
        getPath(){
            return {
                path : global_settings['log_module']['log_path'],
                log_path : global_settings['log_module']['log_path'] + 'records\\logs\\',
                daily_path :  global_settings['log_module']['log_path'] + 'records\\daily\\'
            }
        },
        getFiles(){
            const { path, log_path, daily_path } = this.getPath();
            fs.readdir(daily_path, (err ,files) => {
                if(err){
                    Info.error('RecordsReader','读取日志目录失败' + err);
                }else{
                    files.forEach( e => pather.extname(e) === '.yson' && this.files.daily.push(e));
                }
            });
            fs.readdir(log_path, (err ,files) => {
                if(err){
                    Info.error('RecordsReader','读取记录目录失败' + err);
                }else{
                    files.forEach( e => pather.extname(e) === '.log' && this.files.logs.push(e));
                }
            });
        },
        loadFile(filename, type){
            let { log_path, daily_path } = this.getPath();
            switch(type){
                case 'log':
                    fs.readFile(log_path + filename, (err, data) => {
                        if(err){
                            Info.error('RecordsReader','读取日志失败' + err);
                        }else{
                            try{
                                data.toString('utf8').split(/[\n\r]/).forEach( e => e && this.records.logs.push(e));
                                const f = this.files.logs;
                                f.splice(f.indexOf(filename), 1);
                            }catch(e){
                                Info.error('RecordsReader','读取日志失败' + e);
                            }
                        }
                    });
                    break;
                case 'daily':
                    fs.readFile(daily_path + filename, (err, data) => {
                        if(err){
                            Info.error('RecordsReader','读取记录失败' + err);
                        }else{
                            const res = data.toString('utf8').split(/[\n\r]/);
                            res.forEach( e => {
                                try{
                                    const json = JSON.parse(e);
                                    json.forEach( i => {
                                        if(typeof i.gift_name !== 'undefined'){
                                            this.records.gift.push(i);
                                        }else if(typeof i.guard_type !== 'undefined'){
                                            this.records.guard.push(i);
                                        }else if(typeof i.message !== 'undefined' && typeof i.price !== 'undefined' && typeof i.date !== 'undefined'){
                                            this.records.sc.push(i);
                                        }else{
                                            this.records.danmu.push(i);
                                        }
                                    });
                                }catch(e){

                                }
                            });
                            const f = this.files.daily;
                            f.splice(f.indexOf(filename), 1);
                        }
                    });
                    break;
            }
        },
    },
    mounted() {
        this.getFiles();
    },
}
</script>

<style scoped>
    #logs-menu{
        height: 230px;
        overflow: scroll;
    }

    .menu-font{
        font-size: small;
        font-family: 'DanmuFont';
    }

    .log{
        cursor: pointer;
    }

    .log:hover{
        background-color: lightblue;
    }
</style>>