<template>
    <ECharts class="charts-items__fl" 
             :options="polar"
             theme="light"
    />
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/component/grid';

export default {
    name : 'PieCharts',
    components : { ECharts },
    props : {
        model : {
            default(){
                return { date : [] }
            },
            type : Object
        },
        title : {
            default : '饼图',
            type : String
        },
        subtext : {
            default : '饼图',
            type : String
        },
    },
    methods : {
        refreshData(){
            this.polar.series[0].data = this.model.data;
            this.polar.legend.data = this.polar.series[0].data.map( n => n.name );
        }
    },
    watch :{
        options : {
            handler(){
                this.refreshData();
            },
            immediate : true,
            deep : true,
        },
        _title : {
            handler(){
                this.polar.title.text = this.title;
            },
            immediate : true
        },
        _subtext : {
            handler(){
                this.polar.title.subtext = this.subtext;
            },
            immediate : true
        }
    },
    data : () => ({
        polar :  {
            title: {
                text: '饼图',
                subtext: '饼图',
                left: 'center'
            },
            grid : {
                left : 300,
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: [],
                // selected: data.selected
            },
            series: [
                {
                    name: '对象',
                    type: 'pie',
                    radius: '50%',
                    center: ['50%', '60%'],
                    data: [],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
    }),
}
</script>