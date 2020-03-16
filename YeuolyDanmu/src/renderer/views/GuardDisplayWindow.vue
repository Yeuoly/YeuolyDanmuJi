<template>
    <el-row>
        <el-col v-for="( i, key ) in dist" :key="key" :span="12">
            <div style="padding:5px">
                <div class="guard-msg">
                    <img class="guard-avatar" :src="i.user.face" />
                    <img class="guard-img" :src="i.img"/>
                    <p class="guard-text">{{i.user.id}}开通了{{i.name}}</p>
                    <p class="guard-price"><i class="gold-seed"></i>{{i.price}}</p>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import { getDailyGuardRecordsPointer, getDailyGuardRecords } from '../data/logs';

export default {
    name : 'GuardDisplayWindow',
    data : () => ({
        dist : []
    }),
    methods : {
        get(){
            this.dist = getDailyGuardRecordsPointer();
        }
    },
    mounted(){
        this.get();
    }
}
</script>

<style>

.gold-seed{
    background-position: 0 -35em;
    width: 1em;
    height: 1em;
    font-size: 24px;
    vertical-align: middle;
    display: inline-block;
    background-image: url(//s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/svg-sprite.e15d8c3.svg);
    background-repeat: no-repeat;
    background-size: 1em 116em;
    margin-top: -4px;
    padding-right: 2px;
}

.guard-msg{
    width: calc(100% - 20px);
    padding: 10px;
    height: 70px;
    overflow: hidden;
    position: relative;
    background-color: cadetblue;
    border-radius: 5px;
    font-size: 17px;
    color: white;
    font-family: 'DanmuFont';
    /* border-right: 5px; */
}

.guard-avatar{
    position: absolute;
    width: 70px;
    border-radius: 50%;
    left: 5px;
}

.guard-text{
    position: absolute;
    left: 85px;
    top: -5px;
    line-height: 1.2;
    word-break: break-all;
    padding-right: 4px;
}

.guard-price{
    position: absolute;
    right: 10px;
    bottom: -13px;
}

.guard-img{
    width: 84px;
    position: absolute;
    left: -2px;
    top: 2px;
}

</style>