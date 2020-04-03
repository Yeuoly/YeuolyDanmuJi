<template>
    <div id="cache-manager">
        <el-row>
            <el-col v-for="(i, key) in data" :span="11" :key="key">
                <div class="px3 py2">
                    <div class="block px5 py5">
                        <p class="block-label text-12 text-grey">{{i.label}}</p>
                        <p class="block-value text-25 text-primary my1">{{i.value}}</p>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row id="cache-controller">
            <el-col v-for="(i, key) in ctrl" :span="2" :key="key">
                <el-tooltip :content="i.label" placement="top">
                    <el-button :icon="i.icon" :type="i.color" circle @click="controller(i.value)"></el-button>
                </el-tooltip>
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
            label : '已缓存头像数量',
            value : 0
        },{
            label : '平均每个缓存头像加载耗时',
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
            const store_avatars = store.get('avatars', null);
            if(!store){
                this.avatars_count = 0;
            }else{
                const avatrs = new HashList(2);
                const sizeof = require('object-sizeof');
                console.log(store_avatars);
                avatrs.cover(store_avatars, 2);
                this.data[0].value = avatrs.getOriginLength();
                const start = new Date().getTime();
                for(let i = 0; i < 300000000 ; i++){}
                const end = new Date().getTime();
                this.data[1].value = (Math.log(this.data[0].value) / Math.log(Math.E)) * ( ( end - start ) / 300000000 ) * 30 + 'ms';
                this.data[2].value = Utils.getVisualMemorySize(sizeof(store_avatars));
                this.data[3].value = Utils.getVisualMemorySize(sizeof(getDailyDanmuRecords()));
                this.data[4].value = Utils.getVisualMemorySize(sizeof(getDailyGiftRecords()));
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

    #cache-manager #cache-controller{
        width: 750px;
        position: absolute;
        bottom: 10px;
        left: 20px;
    }

</style>