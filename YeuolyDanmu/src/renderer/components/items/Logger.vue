<template>
    <div class="holder">
        <div class="logger">
            <p  
                v-for="( i, key ) in logs"
                :key ="key"
                :class="'log ' + i.class_name"
                :id="'log-' + i.line_id"
            >{{ i.log }}</p>
        </div>
        <div class="info">logs:{{lines}} errors:{{errors.length}} warnings:{{warnings.length}} </div>
    </div>
</template>

<script>
import { InfoEventBus } from '../../events/evnetBus';
import INFO from '../../class/Info';

const max_line = 2000;

export default {
    name : 'Logger',
    data : () => ({
        lines : 3,
        logs : [{
            class_name : 'grey',
            log : '[LogConsole]:日志模块已启动',
            type : 'info',
            line_id : 0
        },{
            class_name : 'grey',
            log : '大佬好.jpg，我是这个弹幕姬的作者Yeuoly，这个破弹幕姬基于Electron+Vue+ElementUI开发，' +
                '希望您能用着舒服。如果大佬们想参加发开的话我留个链接放这里orz https://github.com/Yeuoly/YeuolyDanmuJI',
            type : 'info',
            line_id : 1
        },{
            class_name : 'grey',
            log : '顺便再放一个联系方式：QQ2035914926',
            type : 'info',
            line_id : 2
        }],
        errors : [],
        warnings : [],
    }),
    methods : {
        insert(text,color,type){
            this.logs.push({ class_name : color, log : text, type : type, line_id : this.lines });
            switch(type){
                case 'error': this.errors.push(this.lines); break;
                case 'warning': this.warnings.push(this.lines); break;
            }
            this.lines++;
            if(this.lines > max_line){
                setTimeout(() => {
                    this.logs = [];
                    this.lines = 0;
                },500);
            }
        }
    },
    mounted() {
        InfoEventBus.$on('logger-insert',this.insert);
    },
}
</script>

<style scoped>

    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    ::-webkit-scrollbar
    {
        width: 8px;
        height: 8px;
        /* background-color: rgb(240,240,240); */
    }
 
    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track
    {
        /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);*/
        /*border-radius: 10px;*/
        /* background-color: rgb(30,30,30); */
    }
 
    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb
    {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: #555;
    }

    .green{
        color: green;
    }
    .red{
        color: red;
    }
    .grey{
        color: grey;
    }
    .orange{
        color: orange;
    }
    .log{
        min-height: 15px;
        font-size: 14px;
        padding: 0;
        margin-top: 0;
        margin-bottom: 0;
    }
    .holder{
        padding: 0;
        margin: 0;
        border: 0;
        height: 100%;
        background-color: rgb(30,30,30);
    }
    .logger{
        height: calc(100% - 15px);
        width: 100%;
        background-color:transparent;
        position: relative;
        overflow-y: scroll;
    }
    .info{
        padding-right: 5px;
        color: grey;
        text-align: right; 
        font-size: 13px;
        width: calc(100% - 10px);
        height: 15px;
        position: absolute;
        bottom: 5px;
        background-color: rgb(60,60,60);
    }
</style>