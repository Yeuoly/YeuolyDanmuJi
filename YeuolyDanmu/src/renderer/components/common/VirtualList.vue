<template>
    <div class="virtual-list" ref="master" :style="{ height: height + 'px' }" @scroll="scroll">
        <div class="virtual-list-wrapper" :style="style">
            <div v-for="(i , key) in virtual_list" :key="key" class="virtual-list-item" :style="{ height: itemHeight + 'px' }">
                <slot name="inner" :data="i"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name : 'VirtualList',
    props : {
        data : { required : true, default : () => [] },
        height : { required : false, default : () => 300 },
        itemHeight : { required : false, default : () => 30 }
    },
    data : () => ({
        start_index : 0,
        end_index : 60,
        padding_bottom : 0,
        padding_top : 0,
        all_height : 0
    }),
    watch: {
        data(v){
            const len = v.length;
            this.all_height = len * this.itemHeight;
            this.padding_bottom = this.all_height - this.virtual_list.length * this.itemHeight;
        }
    },
    computed: {
        virtual_list(){
            return this.data.slice(this.start_index, this.end_index);
        },
        style(){
            return { paddingTop : this.padding_top + 'px', paddingBottom : this.padding_bottom + 'px' };
        }
    },
    methods: {
        scroll(){
            if (this.end_index >= this.data.length - 1) {
                this.padding_bottom = 0;
                return;
            }
            const top = this.$refs.master.scrollTop;
            this.start_index = Math.floor(top / this.itemHeight);
            this.end_index = this.start_index + 60;
            this.padding_top = top;
            this.padding_bottom = this.all_height - this.height - top;
        }
    },
    mounted() {
        
    },
}
</script>

<style>
    .virtual-list{
        width: 100%;
        overflow: auto;
    }
</style>