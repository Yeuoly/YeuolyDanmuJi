<template>
    <div id="cache-manager">
        <el-row>
            <el-col :span="22">
                <el-col v-for="(i, key) in data" :span="11" :key="key">
                    <div class="px3 py2">
                        <div class="block pl3 py5">
                            <p class="block-label text-12 text-grey">{{i.label}}</p>
                            <p class="block-value text-25 text-primary my1">{{i.value}}</p>
                        </div>
                    </div>
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
import Store from 'electron-store';
import HashList from '../class/HashList';
import Utils from '../class/Utils';
import { getDailyGiftRecords, getDailyDanmuRecords } from '../data/records_ipc';
import { OrdinaryEventBus } from '../events/evnetBus';

const store = new Store();

export default {
    name : 'cache-manager',
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
        ctrl : [{
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
        }]
    }),
    methods: {
        loadData(){
            const store_avatars = store.get('store-avatars', null);
            if(!store){
                this.avatars_count = 0;
            }else{
                const avatrs = new HashList(2);
                const sizeof = require('object-sizeof');
                avatrs.cover(store_avatars, 2);
                this.data[0].value = avatrs.getOriginLength();
                this.data[1].value = Utils.getVisualMemorySize(sizeof(store_avatars));
                this.data[2].value = Utils.getVisualMemorySize(sizeof(getDailyDanmuRecords()));
                this.data[3].value = Utils.getVisualMemorySize(sizeof(getDailyGiftRecords()));
            }
        },
        controller(v){
            switch(v){
                case 'delete-all':
                    break;
                case 'delete-low-pro':
                    break;
                case 'delete-high-pro':
                    break;
            }
            
        }
    },
    mounted() {
        this.loadData();
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