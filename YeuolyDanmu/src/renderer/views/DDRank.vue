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
import { getInteractionalDDs, getPaiedDDs } from '../data/logs';
import { room_id_controller } from '../data/settings';
import Axios from 'axios';
import api from '../settings/api';
import Info from '../class/Info';

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
                const response = await Axios.get(
                    `${api.bili_get_seven_rank}?roomid=${target_info.room_id}&ruid=${target_info.uid}`
                );
                this.seven_rank = response.data['data']['list'];
                Info.log('GET_SEVEN_RANK','获取七日榜成功','green');
            }catch(e){
                Info.warning('GET_SEVEN_RANK','获取七日榜失败');
            }
            const rank_i = getInteractionalDDs();
            const rank_p = getPaiedDDs();
            //一开始是准备用链表排序的，但最后还是选择用快排了
            //u1s1，我对快排还是不熟悉，或者说没有完全理解，还是需要多在纸上练几次，理解一下快排的思想
            function quickSort(src,l,r,index){
                //如果右边小了就退出
                if(r <= l)return;
                //选取基准数
                const stanrd = src[l];
                let i = l, j = r;
                while(i < j){
                    //开始从后往前找一个比基准数小的
                    while(src[j][index] >= stanrd[index] && i < j)j--;
                    //找到了一个比标准值小的，替换
                    if(i < j) src[i++] = src[j];
                    //现在坑留在了j，开始从前往后找一个比基准数大的
                    while(src[i][index] < stanrd[index] && i < j)i++;
                    //找到了一个比标准值大的，替换
                    if(i < j) src[j--] = src[i];
                    //现在坑留在了i，如果i<j，就会跑上面那个while了
                }
                //让我们把最后那个留下来的坑填了，其实这时候i=j
                src[i] = stanrd;
                //让我们开始下一轮迫害
                quickSort(src, l, i - 1, index);
                quickSort(src, i + 1, r, index);
            }
            //开始排序
            quickSort(rank_i, 0 ,rank_i.length - 1,'times');
            quickSort(rank_p, 0 ,rank_p.length - 1,'price');
            const len_i = rank_i.length;
            const len_p = rank_p.length;
            const max_len_i = Math.min(len_i,100);
            const max_len_p = Math.min(len_p,100);
            this.danmu_rank.splice(0,this.danmu_rank.length);
            this.paied_rank.splice(0,this.paied_rank.length);
            for(let i = 0; i < max_len_i; i++){
                this.danmu_rank.push(rank_i[len_i - i - 1]);
            }
            for(let i = 0; i < max_len_p; i++){
                this.paied_rank.push(rank_p[len_p - i - 1]);
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
    watch : {
        '$route.name' : {
            handler(v){
                v === 'dd-rank' && this.computeRank();
            },
            immediate : true
        }
    }
}
</script>