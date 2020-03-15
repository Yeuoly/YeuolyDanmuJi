<template>
    <div>
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
                  max-height="450px"
                  stripe
        >
            <el-table-column label="房间短号" prop="short_id"></el-table-column>
            <el-table-column label="房间号" prop="room_id"></el-table-column>
            <el-table-column label="更新日期" prop="date"></el-table-column>
            <el-table-column label="up主" prop="up_name"></el-table-column>
            <el-table-column label="上次标题" prop="title"></el-table-column>
            <el-table-column label="直播状态">
                <template slot-scope="scope">
                    <span :style="{ color : scope.row.live_status === 1 ? '#54a954' : 'grey' }"
                    >{{ scope.row.live_status === 1 ? '直播中' : '未开播' }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="selectHistory(scope.row.room_id)">选中</el-button>
                    <el-button size="mini" type="text" @click="removeHistory(scope.row.room_id)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { room_id_controller } from '../data/settings';
import api from '../settings/api';
import axios from 'axios';

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
        cycleLiveInfo(){
            const tot_len = this.history.length;
            let cur_len = 0;
            this.history.forEach( ( e , index ) => {
                axios.get(`${api.bili_get_live_info}?room_id=${e.room_id}`).then( r => {
                    const data = r.data;
                    if(data['code'] !== 0){
                        cur_len++;
                        INFO.error('GET_LIVE_INFO',`代号:${data['code']}`);
                    }else{
                        cur_len++;
                        e.title = data['data']['room_info']['title'];
                        e.date = new Date().format('MM-dd hh:mm:ss');
                        e.live_status = data['data']['room_info']['live_status'];
                        e.up_name = data['data']['anchor_info']['base_info']['uname'];
                        if(index === tot_len - 1){
                            this.save();
                        }  
                    }
                });
            });
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
            }
        }
    }
    
}
</script>

<style>

</style>