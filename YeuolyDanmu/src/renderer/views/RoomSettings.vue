<template>
    <div id="room-settings">
        <el-input style="background-color:transparent;" placeholder="房间号" v-model.number="room_id">
            <el-button style="background-color:transparent"
                :loading="room_id_lock"
                :disabled="!room_id" 
                slot="append" 
                @click="setRoomID"
            >保存</el-button> 
        </el-input>
        <el-table :data="history" 
                  style="width :100%;margin-top:15px"
                  max-height="440px"
                  stripe
        >
            <el-table-column width="70" label="短号" prop="short_id"></el-table-column>
            <el-table-column width="90" label="房间号" prop="room_id"></el-table-column>
            <el-table-column width="90" label="uid" prop="uid"></el-table-column>
            <el-table-column width="130" label="更新日期" prop="date"></el-table-column>
            <el-table-column label="up主" prop="up_name"></el-table-column>
            <el-table-column label="上次标题" prop="title"></el-table-column>
            <el-table-column width="75" label="状态">
                <template slot-scope="scope">
                    <span :style="{ color : scope.row.live_status === 1 ? '#54a954' : 'grey' }"
                    >{{ scope.row.live_status === 1 ? '直播中' : '未开播' }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="success" @click="selectHistory(scope.row.room_id)" circle icon="el-icon-check"></el-button>
                    <el-button size="mini" type="danger" @click="removeHistory(scope.row.room_id)" circle icon="el-icon-delete"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { room_id_controller } from '../data/settings';
import api from '../settings/api';
import axios from 'axios';
import Info from '../class/Info';
import Utils from '../class/Utils';

export default {
    name : 'RoomSettings',
    data : () => ({
        id_ctrl : room_id_controller,
        history : room_id_controller.history,
        room_id : room_id_controller.getCurrent(),
        room_id_lock : false,
        cyc_timer : null
    }),
    methods: {
        setRoomID(){
            this.id_ctrl.setCurrent(this.room_id);
        },
        removeHistory(room_id){
            this.id_ctrl.remove(room_id);
        },
        save(){
            this.id_ctrl.save();
        },
        selectHistory(room_id){
            this.room_id = room_id;
            this.setRoomID();
        },
        async cycleLiveInfo(){
            const tot_len = this.history.length;
            let cur_len = 0;
            const checkRoom = async ( index ) => {
                try{
                    const r = await axios.get(`${api.bili_get_live_info}?room_id=${this.history[index].room_id}`);
                    const data = r.data;
                    if(data['code'] !== 0){
                        cur_len++;
                        Info.error('GET_LIVE_INFO',`代号:${data['code']}`);
                    }else{
                        cur_len++;
                        this.history[index].title = data['data']['room_info']['title'];
                        this.history[index].date = Utils.formatDate(new Date(),'MM-dd hh:mm:ss');
                        this.history[index].live_status = data['data']['room_info']['live_status'];
                        this.history[index].uid = data['data']['room_info']['uid'];
                        this.history[index].short_id = data['data']['room_info']['short_id'];
                        this.history[index].up_name = data['data']['anchor_info']['base_info']['uname'];
                        Info.log('GET_LIVE_INFO',`获取房间信息成功，房间号：${this.history[index].room_id}`);
                        if(index === tot_len - 1){
                            this.save();
                        }
                    }
                }catch(error){
                    Info.error('GET_LIVE_INFO','获取房间信息失败');
                }
                //这里有必要设个300ms延迟，避免被B站banIP
                setTimeout(() => {
                    if(index !== tot_len - 1){
                        checkRoom(index + 1);
                    }
                },300);
            }
            checkRoom(0);
        },
        setupCycle(){
            this.cycleLiveInfo();
            this.cyc_timer = setInterval(() => { this.cycleLiveInfo() },60000);            
        },
        clearCycle(){
            clearInterval(this.cyc_timer);
        }
    },
    watch : {
        '$route.name' : {
            handler(v){
                v === 'room-settings' ? this.setupCycle() : this.clearCycle();
            },
            immediate : true
        }
    }
    
}
</script>

<style>
#room-settings > *{
    text-align: center;
}
</style>