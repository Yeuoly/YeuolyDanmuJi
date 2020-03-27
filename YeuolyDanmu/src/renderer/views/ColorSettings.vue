<template>
    <div>
        <color-picker id="picker" v-model="current_color"></color-picker>
        <el-button @click="add" round>添加颜色</el-button>
        <el-button @click="clear" round>清空当前色组</el-button>
        <el-button @click="save" round>保存为我的色组</el-button>
        <hr>
        <div class="group-holder">
            <color-group v-model="current_color_group"></color-group>
            <span class="color-group-title"> | 当前色组</span>
        </div>
        <hr>
        <div v-for="( i , key_g ) in default_color_groups" 
            :key="key_g"
            class="group-holder"
        >
            <span class="color-group-title"> | 预设色组{{ key_g + 1 }}</span>
            <color-group :value="i" :disabled="true" ></color-group>
            <div class="color-btns">
                <el-button size="small" @click="use('default',key_g)">选中替换当前色组</el-button>
            </div>
        </div>
        <hr>
        <div v-for="( i , key_m ) in mine_color_groups" 
            :key="'m' + key_m"
            class="group-holder"
        >
            <span class="color-group-title"> | 我的色组{{ key_m + 1 }}</span>
            <color-group :value="i" :disabled="true" ></color-group>
            <div class="color-btns">
                <el-button size="small" @click="use('mine',key_m)">选中替换当前色组</el-button>
                <el-button size="small" @click="deleteThis(key_m)">删除色组</el-button>
            </div>
        </div>
    </div>
</template>

<script>

//初始化颜色数据
import Store from 'electron-store';
import ColorGroup from '../components/items/ColorGroup';
const store = new Store();
const saved_color_groups = store.get('color-group-saved',[]);
const color_group_using = store.get('color-group-using',[]);

const ipc = require('electron').ipcRenderer;

export default {
    name : 'ColorSettings',
    components : { ColorGroup },
    data : () => ({
        color_groups : saved_color_groups,
        current_color : 'rgb(218,229,240)',
        current_color_group : color_group_using,
        default_color_groups : [
            [
                'rgb(242,174,185)','rgb(245,198,162)','rgb(255,251,177)','rgb(130,194,71)','rgb(207,100,146)',
                'rgb(233,120,132)','rgb(237,137,165)','rgb(183,221,201)','rgb(255,255,255)','rgb(223,223,221)'
            ],
            [
                'rgb(92 ,80 ,130)','rgb(132,135,166)','rgb(237,155,53 )','rgb(196,153,170)','rgb(112,69,140)',
                'rgb(226,86 ,97 )','rgb(122,166,191)','rgb(132,135,166)','rgb(76,176,52)','rgb(92,80,130)'
            ]
        ],
        mine_color_groups : saved_color_groups
    }),
    methods: {
        use(type,key){
            let colors;
            if(type === 'default')
                colors = this.default_color_groups[key].slice(0);
            else if(type === 'mine')
                colors = this.mine_color_groups[key].slice(0);
            this.current_color_group = colors;
            store.set('color-group-using',colors);
            ipc.send('to-danmu','setting-color',colors);
        },
        add(){
            if(this.current_color_group.length <= 16);
                this.current_color_group.push(this.current_color);
        },
        save(){
            if(this.current_color_group.length === 0)return;
            this.mine_color_groups.push(this.current_color_group);
            store.set('color-group-saved',this.mine_color_groups);
        },
        clear(){
            this.current_color_group = [];
        },
        deleteThis(key){
            this.mine_color_groups.splice(key,1);
            store.set('color-group-saved',this.mine_color_groups);
        }
    },
}
</script>

<style>
.color-btns{
    float: right;
    transform: translateY(-6px);
}
.group-holder{
    padding: 10px;
}
#picker .colorBtn{
    cursor: pointer;
    margin-left: 10px;
    width: 90px;
    height: 37px;
    border-radius: 18px;
    transform: translateY(13px);
}
.color-group-title{
    font-size: 18px;
    color: grey;
}
hr{
    margin: 5px;
}
</style>