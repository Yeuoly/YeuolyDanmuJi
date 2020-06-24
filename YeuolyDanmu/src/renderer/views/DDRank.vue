<template>
    <div>
        <el-row>
            <el-col :span="24" >
                <el-table :data="seven_rank" stripe>
                    <el-table-column prop="rank" label="七日榜排名"></el-table-column>
                    <el-table-column prop="uname" label="昵称"></el-table-column>
                    <el-table-column prop="uid" label="uid"></el-table-column>
                    <el-table-column prop="score" label="金瓜子"></el-table-column>
                    <el-table-column label="舰队">
                        <template slot-scope="scope">
                            <span>{{ guard_name(scope.row.guard_level) }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <hr />
            <el-col :span="24">
                <el-table :data="paied_rank" stripe>
                    <el-table-column label="本次打钱排名">
                        <template slot-scope="scope">
                            <span>{{ scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" label="用户名"></el-table-column>
                    <el-table-column prop="uid" label="uid"></el-table-column>
                    <el-table-column prop="price" label="打钱总额"></el-table-column>
                </el-table>
            </el-col>
            <hr />
            <el-col :span="24">
                <el-table :data="danmu_rank" stripe>
                    <el-table-column label="互动排名">
                        <template slot-scope="scope">
                            <span>{{ scope.$index + 1 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" label="用户名"></el-table-column>
                    <el-table-column prop="uid" label="uid"></el-table-column>
                    <el-table-column prop="times" label="互动了多少次"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getInteractionalDDs, getPaiedDDs } from '../data/records_ipc';
import { room_id_controller } from '../data/settings';
import { OrdinaryEventBus } from '../events/evnetBus';
import Axios from 'axios';
import api from '../settings/api';
import Info from '../modules/Info';

export default {
    name : "DDRank",
    data : () => ({
        seven_rank : [],
        paied_rank : [],
        danmu_rank : [],
    }),
    methods : {
        async computeRank(){
            //拿uid和room_id，这里不知道为什么，拿七日榜同时需要uid和room_id
            const room_info = room_id_controller.getHistory();
            const current_room_id = room_id_controller.getCurrent();
            const target_info = { uid : 0, room_id : current_room_id };
            for(let i in room_info){
                if(room_info[i].room_id === current_room_id){
                    target_info.uid = room_info[i].uid;
                    break;
                }
            }
            try{
                const { data } = await Axios.get(`${api.bili_get_seven_rank}?roomid=${target_info.room_id}&ruid=${target_info.uid}`);
                this.seven_rank = data['data']['list'];
                Info.log('GetSevenDayRank','获取七日榜成功','green');
            }catch(e){
                Info.warning('GetSevenDayRank','获取七日榜失败');
            }
            const rank_i = getInteractionalDDs();
            const rank_p = getPaiedDDs();
            const len_i = rank_i.length;
            const len_p = rank_p.length;
            const max_len_i = Math.min(len_i, 100);
            const max_len_p = Math.min(len_p, 100);
            function quickSort(src, l, r, index, max){
                if(r <= l)return;
                const stanrd = src[l];
                let i = l, j = r;
                while(i < j){
                    while(src[j][index] < stanrd[index] && i < j)j--;
                    if(i < j) src[i++] = src[j];
                    while(src[i][index] >= stanrd[index] && i < j)i++;
                    if(i < j) src[j--] = src[i];
                }
                src[i] = stanrd;
                //人多了会栈溢出，一开始没注意到这一点，做一下优化，只排需要显示的
                quickSort(src, l, i - 1, index, max);
                if(i < max - 1)quickSort(src, i + 1 ,r ,index, max);
            }
            //开始排序
            quickSort(rank_i, 0, rank_i.length - 1, 'times', max_len_i);
            quickSort(rank_p, 0, rank_p.length - 1, 'price', max_len_p);
            this.danmu_rank.splice(0, this.danmu_rank.length);
            this.paied_rank.splice(0, this.paied_rank.length);
            for(let i = 0; i < max_len_i; i++){
                this.danmu_rank.push(rank_i[i]);
            }
            for(let i = 0; i < max_len_p; i++){
                this.paied_rank.push(rank_p[i]);
            }
        }
    },
    computed : {
        guard_name(level){
            return level => {
                switch(level){
                    case 0:
                        return '非舰队成员';
                    case 1:
                        return '总督';
                    case 2:
                        return '提督';
                    case 3:
                        return '舰长';
                }
            }
        }
    },
    mounted() {
        this.computeRank();
        OrdinaryEventBus.$on('router-to-dd-rank',this.computeRank);
    },
}
</script>