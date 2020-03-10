<template>
    <ECharts class="charts-items__fl"
             :options="polar"
             theme="westeros"
             ref="chart"
    />
</template>

<script>
    import ECharts from 'vue-echarts/components/ECharts';
    import 'echarts/lib/chart/bar';
    import 'echarts/lib/component/title';
    import 'echarts/lib/component/grid';
    import 'echarts/lib/component/dataZoom';

    export default {
        name: "DateValueHistogramCharts",
        components : { ECharts },
        computed : {
            options(){
                return this.model;
            },
            _title(){
                return this.title;
            },
            _subtext(){
                return this.subtext;
            },
        },
        methods : {
            refreshData(){
                this.polar.series[0].data = this.model.value;
                this.polar.xAxis.data = this.model.date;
            },
        },
        watch : {
            options : {
                handler(){
                    this.refreshData();
                },
                immediate : true,
                deep : true,
            },
            _title : {
                handler(){
                    this.polar.title.text = `{title_text|${this.title}}`;
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
        data(){
            return {
                output : {},
                polar : {
                    xAxis : {
                        type : 'category',
                    },
                    yAxis : {
                        type : 'value',
                        scale: true
                    },
                    grid : {
                        left : 73
                    },
                    series : [{
                        type : 'bar',
                        data : []
                    }],
                    title : {
                        text : '',
                        subtext : '',
                        show : true,
                        textStyle : {
                            rich : {
                                title_text : 'grey'
                            }
                        }
                    },
                    dataZoom : [{
                        type : 'inside',
                        realtime : true,
                        start : 90,
                        end : 100
                    }, {
                        type : 'slider',
                        handleSize : '80%',
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                        }
                    }]
                }
            }
        },
        props : {
            model : {
                default(){
                    return { date : [] , value : [] }
                },
                type : Object
            },
            title : {
                default : '时间-数据平滑折线',
                type : String
            },
            subtext : {
                default : '时间-数据平滑折线',
                type : String
            },
        }
    }
</script>

<style>
    .charts-items__fl{
        width: 100%;
        height: 100%;
    }
</style>