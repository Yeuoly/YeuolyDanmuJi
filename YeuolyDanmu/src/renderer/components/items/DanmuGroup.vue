<template>
    <div ref="controller" class="danmu-group">
        <Danmu v-for="( i , key ) in Danmus"
               :Danmu="i"
               :key="key"
               :text-color="textColor"
               :uname-color="unameColor"
               :font="font"
        ></Danmu>
    </div>
</template>

<script>

import Danmu from './Danmu';
import { DanmuGroupEventBus } from '../../events/evnetBus';

const max_offset = require('electron').screen.getPrimaryDisplay().workAreaSize.height;

export default {
    name : 'DanmuGroup',
    components : { Danmu },
    props : ['Danmus','textColor','unameColor','font'],
    data : () => ({
        isShow : false,
        offset : 0,
        finished_children_count : 0
    }),
    methods: {
        teleParent(){
            const height = this.$refs.controller.offsetHeight;
            DanmuGroupEventBus.$emit('move',height);
        },
        move(offset){
            if(this.offset > max_offset){
                DanmuGroupEventBus.$off('move',this.move);
                return;
            }
            this.offset += offset;
            this.$refs.controller.style['transform'] = `translateY(-${this.offset}px)`;
        },
        show(){
            if(this.isShow)return;
            this.isShow = true;
            this.$refs.controller.style.opacity = 1;
            // DanmuGroupEventBus.$off(`show-${this.key}`,this.show)
        }
    },
    mounted() {
        this.teleParent();
        // DanmuGroupEventBus.$on(`show-${this.key}`,this.show);
        //这里teleParent和$on顺序不能反
        DanmuGroupEventBus.$on('move',this.move);
        //不止于加载这么慢叭，
        setTimeout(() => { this.show(); },300);
        //this.show();
    },
    beforeDestroy() {
        DanmuGroupEventBus.$off('move',this.move);
    },
}
</script>

<style scoped>
.danmu-group{
    opacity: 0;
    transition: all .4s;
    position: absolute;
    overflow: auto;
    bottom: 0;
    width: 100%;
    margin-left: -9px;
}
</style>