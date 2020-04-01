<template>
    <div id="room-settings">
        <el-autocomplete placeholder="房间信息"
                         v-model="search.kw"
                         popper-class="input-width-select w100"
                         :fetch-suggestions="emitSearcher"
                         class="w100"
                         @select="select"
        >
            <template slot-scope="{ item }">
                <LiveRoomShortcut :uname="item.uname"
                                  :room_id="item.room_id"
                                  :face="item.face"
                                  :live_status="item.live_status"
                 />
            </template>
            <el-select slot="prepend" 
                       v-model="search.value"
            >
                <el-option v-for="i in search.options" 
                           :key="i.value" 
                           :value="i.value" 
                           :label="i.label"
                ></el-option>
            </el-select>
            <div slot="append">
                <el-button
                    @click="handleSearch"
                    circle
                    type="info"
                    icon="el-icon-search"
                ></el-button>
            </div>
        </el-autocomplete>
        <LED prepend="刷新状态" class="py4 left pr3" :boot="current.cycling" />
        <div class="py4 text-grey text-12 left">
            当前房间号：{{room_id}}
        </div>
        <el-table :data="history" 
                  class="w100 mt5"
                  max-height="420px"
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
import { IntervalTimer } from '../class/Timer';
import api from '../settings/api';
import axios from 'axios';
import Info from '../class/Info';
import Utils from '../class/Utils';
import qs from 'querystring';
import LiveRoomShortcut from '../components/items/LiveRoomShortcut';
import LED from '../components/items/LED';

export default {
    name : 'RoomSettings',
    components : { LiveRoomShortcut, LED },
    data : () => ({
        id_ctrl : room_id_controller,
        history : room_id_controller.history,
        room_id : room_id_controller.getCurrent(),
        room_id_lock : false,
        cyc_timer : null,
        search : {
            options : [{
                value : 1,
                label : '房间号或关键词'
            }],
            value : 1,
            kw : '',
            timer : null,
            cb : null
        },
        current : {
            cycling : false,
        }
    }),
    methods: {
        setRoomID(){
            this.id_ctrl.setCurrent(this.room_id);
        },
        select(e){
            this.room_id = e.room_id;
            this.setRoomID();
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
            this.current.cycling = true;
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
                            this.current.cycling = false;
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
        },
        emitSearcher(qs,cb){
            this.search.timer.$continue('search');
            this.search.cb = cb;
        },
        async handleSearch(){
            const kw = this.search.kw || 'Yeuoly';
            try{
                const r = await axios.get(api.bili_get_live_search, {
                    params : {
                        context : '',
                        search_type : 'live',
                        cover_type : 'user_cover',
                        page : 1,
                        keyword : kw,
                        category_id : '',
                        __refresh__ : true,
                        _extra : '',
                        highlight : '',
                        singe_column : 0,
                    }
                });
                const data = r.data;
                if(data['code'] !== 0){
                    Info.error('GET_LIVE_SEARCH_LIST','获取直播间列表失败');
                }
                const list = data['data']['result']['live_user'];
                this.search.cb( list.map( v => {
                    return {
                        uname : v.uname,
                        uid : v.uid,
                        room_id : v.roomid,
                        live_status : v.is_live,
                        face : v.uface
                    }
                }));
            }catch(e){
                Info.error('GET_LIVE_SEARCH_LIST','获取直播列表发生意外');
            }
        }
    },
    watch : {
        '$route.name' : {
            handler(v){
                v === 'room-settings' ? this.setupCycle() : this.clearCycle();
            },
            immediate : true
        }
    },
    mounted() {
        this.search.timer = new IntervalTimer();
        this.search.timer.$on('search', this.handleSearch, 1);
    },
}
</script>

<style>
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .el-select .el-input {
    width: 130px;
  }
  #room-settings *.cell{
      text-align: center;
  }
</style>