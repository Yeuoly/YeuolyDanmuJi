<template>
    <div id="cache-manager">
        <el-dialog :title="`刷新头像缓存中…… `"
                   :visible.sync="refresh.show"
                   :before-close="stopRefreshAvatars"
                   :status="refresh_status"
        >
            <VOdometer theme="minimal"
                       format=""
                       :value="refresh.cur"
            ></VOdometer> / 
            <VOdometer theme="minimal"
                       format=""
                       :value="refresh.tot"
            ></VOdometer>
            <el-progress :text-inside="true" 
                         :stroke-width="18" 
                         :percentage="refresh.progress"
            ></el-progress>
        </el-dialog>
        <el-row>
            <el-col :span="22">
                <el-col v-for="(i, key) in data" :span="12" :key="key">
                    <div class="px3 py2">
                        <div class="block pl3 py5">
                            <p class="block-label text-12 text-grey">{{i.label}}</p>
                            <p class="block-value text-25 text-primary my1">{{i.value}}</p>
                        </div>
                    </div>
                </el-col>
                <el-col :span="22" class="pl3">
                    <p class="block-label text-14 text-grey">退出选项</p>
                </el-col>
                <el-col :span="24">
                    <el-col :span="12" class="pl3">
                        <el-switch
                            style="display: block"
                            v-model="auto_quit.on"
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            active-text="直接退出或最小化"
                            inactive-text="直接退出前提示">
                        </el-switch>               
                    </el-col>
                    <el-col :span="12">
                        <el-switch
                            style="display: block"
                            v-model="auto_quit.mode"
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            active-text="退出"
                            inactive-text="最小化">
                        </el-switch>
                    </el-col>
                </el-col>
            </el-col>
            <el-col :span="2">
                <el-col v-for="(i, key) in ctrl" :span="24" :key="key">
                    <div class="pb3">
                        <el-tooltip :content="i.label" placement="left">
                            <el-button :icon="i.icon" :type="i.color" circle @click="controller(i.value)"></el-button>
                        </el-tooltip>
                    </div>
                </el-col>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Info from '../modules/Info';
import Utils from '../modules/Utils';
import api from '../settings/api';
import Store from 'electron-store';
import axios from 'axios';
import HashList from '../class/HashList';
import sizeof from 'object-sizeof';
import VOdometer from '../components/items/VOdometer';
import { MessageBox } from 'element-ui';
import { getDailyGiftRecords, getDailyDanmuRecords } from '../data/records_ipc';
import { OrdinaryEventBus } from '../events/evnetBus';
import { getAvatarOrigin, getAvatarCount, setAvatar, getAvatarsList, saveAvatars } from '../modules/Avatar';
import { getStorage, modifyStorage } from '../modules/Store';

const store = new Store();

export default {
    name : 'cache-manager',
    components : { VOdometer },
    data : () => ({
        data : [{
            label : '已缓存头像数量（加载延迟∝数量，但基本在0.01ms以下',
            value : 0
        },{
            label : '头像链接缓存所占内存',
            value : 0
        },{
            label : '弹幕缓存所占内存',
            value : 0
        },{
            label : '礼物缓存所占内存',
            value : 0
        }],
        ctrl : [/*{
            label : '清理全部头像链接缓存',
            icon : 'el-icon-delete',
            value : 'delete-all',
            color : 'danger'
        },{
            label : '低自适应清理头像链接缓存',
            icon : 'el-icon-circle-close',
            value : 'delete-low-pro',
            color : 'success'
        },{
            label : '高自适应清理头像链接缓存',
            icon : 'el-icon-folder-delete',
            value : 'delete-high-pro',
            color : 'primary'
        },*/{
            label : '刷新头像缓存，需要较长时间',
            icon : 'el-icon-refresh-right',
            value : 'refresh-avatars',
            color : 'primary'
        },],
        refresh : {
            show : false,
            timer : null,
            progress : 0,
            over : false,
            cur : 0,
            tot : 0,
        },
        auto_quit : {
            on : false,
            mode : false
        }
    }),
    watch : {
        'auto_quit.on' : {
            handler(v){
                modifyStorage('auto-quit', `${this.auto_quit_switch_res}${this.auto_quit_mode_res}`);
            }
        },
        'auto_quit.mode' : {
            handler(v){
                modifyStorage('auto-quit', `${this.auto_quit_switch_res}${this.auto_quit_mode_res}`);
            }
        }
    },
    computed: {
        refresh_status(){
            return this.refresh.over ? 'success' : 'text';
        },
        auto_quit_switch_res(){
            return this.auto_quit.on ? '1' : '0';
        },
        auto_quit_mode_res(){
            return this.auto_quit.mode ? '1' : '0';
        }
    },
    methods: {
        loadData(){
            setTimeout(() => {
                this.data[0].value = getAvatarCount();
                this.data[1].value = Utils.getVisualMemorySize(sizeof(getAvatarsList()));
                this.data[2].value = Utils.getVisualMemorySize(sizeof(getDailyDanmuRecords()));
                this.data[3].value = Utils.getVisualMemorySize(sizeof(getDailyGiftRecords()));
            });
        },
        controller(v){
            switch(v){
                case 'delete-all':
                    break;
                case 'delete-low-pro':
                    break;
                case 'delete-high-pro':
                    break;
                case 'refresh-avatars':
                    this.refreshAvatars();
                    break;
            }
        },
        loadAutoQuitState(){
            const auto_quit = getStorage('auto-quit','00');
            this.auto_quit.on = auto_quit[0] === '1';
            this.auto_quit.mode = auto_quit[1] === '1' ? true : false;
        },
        stopRefreshAvatars(done){
            if(!this.refresh.over){
                MessageBox.confirm('您确定要取消吗？').then(() => {
                    clearTimeout(this.refresh.timer);
                    done();
                    this.refresh.progress = 0;
                    this.refresh.over = false;
                    saveAvatars();
                }).catch(() => {});
            }else{
                done();
                this.refresh.progress = 0;
                this.refresh.over = false;
                saveAvatars();
            }    
        },
        refreshAvatars(){
            this.refresh.show = true;
            const origin = getAvatarsList();
            const len = origin.length;
            this.refresh.cur = 0;
            this.refresh.tot = len;
            const refresher = async index => {
                if(len === index){
                    this.refresh.progress = 0;
                    this.refresh.show = false;
                    this.refresh.over = true;
                    clearInterval(this.refresh.timer);
                    saveAvatars();
                    return;
                }
                const now = origin[index];
                try{
                    const { data } = await axios.get(`${api.bili_get_space_info}?mid=${now[2]}`);
                    if(data['code'] === 0){
                        setAvatar(now[2],data['data']['face']);
                    }else{
                        Info.warning('REFRESH_AVATARS',`刷新头像错误{ uid:${now[2]}, error:${data['code']}`);
                    }
                }catch(e){
                    Info.warning('REFRESH_AVATARS',`刷新头像错误{ uid:${now[2]}, error:${e}`);
                }
                this.refresh.cur++;
                this.refresh.progress = parseFloat((( index + 1 ) * 100 / len).toFixed(3));
            }
            let cur = 0;
            this.refresh.timer = setInterval(() => {
                refresher(cur++);
            },150);
        }
    },
    mounted() {
        this.loadData();
        this.loadAutoQuitState();
        OrdinaryEventBus.$on('router-to-cache-manager',this.loadData);
    },
}
</script>

<style>
    #cache-manager .block{
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: unset;
        height: 60px;
        background-color: rgb(247,252,254);
        cursor: pointer;
        border-radius: 8px;
        transition: all .1s;
    }

    #cache-manager .block:hover{
        background-color: rgb(235,248,252);
    }

    #cache-manager .block-label{
        margin: 0;
    }

</style>