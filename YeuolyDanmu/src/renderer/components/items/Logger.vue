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
        <div class="info">logs:{{lines}} errors:{{errors.length}} warnings:{{warnings.length}}</div>
    </div>
</template>

<script>
import { InfoEventBus } from '../../events/evnetBus';

export default {
    name : 'Logger',
    data : () => ({
        lines : 0,
        logs : [],
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
        }
    },
    mounted() {
        InfoEventBus.$on('logger-insert',this.insert);
    },
}
</script>

<style scoped>
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
        height: 15px;
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
    }
    .logger{
        height: calc(100% - 15px);
        width: 100%;
        background-color: white;
        position: relative;
        overflow: scroll;
    }
    .info{
        color: grey;
        text-align: right; 
        font-size: 13px;
        width: calc(100% - 10px);
        height: 15px;
        position: absolute;
        bottom: 5px;
        background-color: #dcdcdc;
    }
</style>