<template>
    <div ref="controller" class="danmu-group">
        <div v-if="type === 'normal'">
            <Danmu v-for="( i , key ) in Danmus"
               :Danmu="i"
               :key="key"
               :text-color="textColor"
               :uname-color="unameColor"
               :font="font"
            ></Danmu>
        </div>
        <div v-else-if="type === 'guard'">
            <Guard :Guard="Danmus[0]" 
                :font="font"
            />
        </div>
        <div v-else-if="type === 'gift'">
            <GiftDanmu :Gift="Danmus[0]" 
                :uname-color="unameColor"
                :text-color="textColor"
                :font="font"
            />
        </div>
    </div>
</template>
 
<script>

import Danmu from './Danmu';
import Guard from './Guard';
import GiftDanmu from './GiftDanmu';
import { DanmuGroupEventBus } from '../../events/evnetBus';

const max_offset = window.innerHeight;

export default {
    name : 'DanmuGroup',
    components : { Danmu, Guard, GiftDanmu },
    props : ['Danmus','textColor','unameColor','font','type','index','hidder','hidder-time','clear'],
    data : () => ({
        offset : 0,
        hidder_timer : null
    }),
    methods: {
        teleParent(){
            const height = this.$refs.controller.offsetHeight;
            DanmuGroupEventBus.$emit('move',height);
        },
        move(offset){
            if(this.offset > max_offset){
                this.$emit('end',this.index);
                DanmuGroupEventBus.$off('move',this.move);
                return;
            }
            this.offset += offset;
            this.$refs.controller.style['transform'] = `translateY(-${this.offset}px)`;
        },
        show(){
            this.$refs.controller.style.opacity = 1;
        }
    },
    watch: {
        clear(v){
            v && ( this.$refs.controller.style.opacity = 0 );
        }
    },
    mounted() {
        const height = this.$refs.controller.offsetHeight;
        this.teleParent();
        DanmuGroupEventBus.$on('move',this.move);
        setTimeout(this.show, 300);
        if(this.hidder){
            this.hidder_timer = setTimeout(() => {
                this.$refs.controller.style.opacity = 0;
                setTimeout(() => {
                    this.$emit('end',this.index);
                }, 500);
            },this.hidderTime * 1000);
        }
    },
    beforeDestroy() {
        DanmuGroupEventBus.$off('move',this.move);
        if(this.hidder_timer){
            clearTimeout(this.hidder_timer);
        }
    },
}
</script>