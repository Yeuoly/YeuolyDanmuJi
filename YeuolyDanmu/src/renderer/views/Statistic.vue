<template>
    <div v-if="show" class="statistic">
        <el-row>
            <el-col :span="24">
                <el-table :data="[table_data]">
                    <el-table-column prop="total_price" label="总瓜子"></el-table-column>
                    <el-table-column prop="au_price" label="金瓜子"></el-table-column>
                    <el-table-column prop="ag_price" label="银瓜子"></el-table-column>
                    <el-table-column prop="danmu_count" label="弹幕数量"></el-table-column>
                    <el-table-column prop="interactional_dd_count" label="互动了的DD数量"></el-table-column>
                    <el-table-column prop="paied_dd_count" label="打了钱的DD数量"></el-table-column>
                    <el-table-column prop="total_sc_price" label="总共SC"></el-table-column>
                    <el-table-column prop="total_guard_price" label="总共舰队价值"></el-table-column>
                    <el-table-column prop="total_guard_count" label="总共舰队数量"></el-table-column>
                </el-table>
            </el-col>
            <el-col :span="24">
                <el-table :data="[converse_currency]">
                    <el-table-column prop="CNY" label="人民币"></el-table-column>
                    <el-table-column prop="JPY" label="日本円です"></el-table-column>
                    <el-table-column prop="KRW" label="원 1"></el-table-column>
                    <el-table-column prop="USD" label="United States Dollar"></el-table-column>
                    <el-table-column prop="EUR" label="Eurodollar"></el-table-column>
                </el-table>
            </el-col>
            <el-col :span="12">
                <PieCharts class="pie" title="DD比例" subtext="不同种类DD所占比例" :model="{data:pie.all}" />
            </el-col>
            <el-col :span="12">
                <PieCharts class="pie" title="礼物占比" subtext="金银SC所占比例" :model="{data:pie.paied}" />
            </el-col>
            <el-col :span="24">
                <DateValueSmoothCharts
                    class="line" 
                    title="人气值" 
                    subtext="不同时间段人气值总览"
                    :model="statistic.danmu_speeds"
                />
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getStatisticPointer } from '../data/records_ipc';
import { cny_exchangerate_controller } from '../data/settings';

import PieCharts from '../components/charts/PieCharts';
import DateValueSmoothCharts from '../components/charts/DateValueSmoothCharts';

export default {
    components : { PieCharts, DateValueSmoothCharts },
    data : () => ({
        show : true,
        watcher_func : [],
        statistic : getStatisticPointer(),
        danmu_speed_list : [],
        pie : {
            all : [{
                name : '打钱的DD',
                value : 0
            },{
                name : '白嫖的DD',
                value : 0
            }],
            paied : [{
                name : '银瓜子',
                value : 0
            },{
                name : '金瓜子',
                value : 0
            },{
                name : 'SuperChat',
                value : 0
            },{
                name : '舰队',
                value : 0
            }]
        },
        table_data : {
            total_price : 0,
            au_price : 0,
            ag_price : 0,
            danmu_count : 0,
            interactional_dd_count : 0,
            paied_dd_count : 0,
            total_sc_price : 0,
            total_guard_price : 0,
            total_guard_count : 0
        },
        exchangerate : {}
    }),
    methods : {
        initWatcher(){
            this.watcher_func.push(
                this.$watch('statistic.paied_dd_count', v => {
                    this.pie.all[1]['value'] = this.statistic.interactional_dd_count - v;
                    this.pie.all[0]['value'] = v;
                    this.table_data.paied_dd_count = v;
                },{immediate:true})
            );
            this.watcher_func.push(
                this.$watch('statistic.interactional_dd_count' , v => {
                    this.pie.all[1]['value'] = v - this.statistic.paied_dd_count;
                    this.table_data.interactional_dd_count = v;
                },{immediate:true})
            );
            this.watcher_func.push(
                this.$watch('statistic.ag_price', v => {
                    this.pie.paied[0]['value'] = v;
                    this.table_data.ag_price = v;
                },{immediate:true})
            );
            this.watcher_func.push(
                this.$watch('statistic.au_price', v => {
                    this.pie.paied[1]['value'] = v;
                    this.table_data.au_price = v;
                },{immediate:true})
            );
            this.watcher_func.push(
                this.$watch('statistic.total_sc_price', v => {
                    this.pie.paied[2]['value'] = v * 1000;
                    this.table_data.total_sc_price = v;
                },{immediate:true})
            );
            this.watcher_func.push(
                this.$watch('statistic.danmu_count', v => {
                    this.table_data.danmu_count = v;
                },{immediate:true})
            );
            this.watcher_func.push(
                this.$watch('statistic.total_price', v => {
                    this.table_data.total_price = v;
                },{immediate:true})
            );
            this.watcher_func.push(
                this.$watch('statistic.total_guard_price', v => {
                    this.table_data.total_guard_price = v;
                    this.pie.paied[3]['value'] = v;
                },{immediate:true})
            );
            this.watcher_func.push(
                this.$watch('statistic.total_guard_count', v => {
                    this.table_data.total_guard_count = v;
                },{immediate:true})
            );
        },
        offWatcher(){
            this.watcher_func.forEach( e => { e(); } );
            this.watcher_func = [];
        },
    },
    computed : {
        converse_currency(){
            const CNY = this.table_data.total_sc_price + this.table_data.total_guard_price / 1000
                + this.table_data.au_price / 1000;
            return {
                CNY : CNY.toFixed(3),
                USD : ( CNY * this.exchangerate.USD ).toFixed(3),
                JPY : ( CNY * this.exchangerate.JPY ).toFixed(3),
                EUR : ( CNY * this.exchangerate.EUR ).toFixed(3),
                KRW : ( CNY * this.exchangerate.KRW ).toFixed(3)
            }
        }
    },
    beforeDestroy() {
        this.offWatcher();
    },
    mounted(){
        //抓一波汇率
        this.exchangerate = cny_exchangerate_controller.get();
    },
    watch : {
        '$route.name' : {
            handler(v){
                const p = v === 'statistic'
                this.show = p;
                if(p){
                    this.initWatcher();
                }else{
                    this.offWatcher();
                }
            },
            immediate : true
        }
    }
}
</script>

<style>
.line{
    width: 100%;
}
.pie{
    width: 100%;
}
</style>