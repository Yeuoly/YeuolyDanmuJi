<template>
    <div class="px5">
       <el-tabs v-model="active_name">
            <el-tab-pane label="默认" name="default"></el-tab-pane>
            <el-tab-pane v-for="i in plugins" 
                :key="i.id"
                :label="i.label"
                :name="i.name"
             >
                <div :id="i.el_id"></div>
             </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { plugins } from '../boot/plugin';

export default {
    name : 'Plugins',
    data : () => ({
        plugins : plugins,
        active_name : 'default'
    }),
    mounted(){
        setTimeout(() => {
            this.plugins.forEach( e => {
                if(e.boot){
                    e.mount();
                }
            });
        },1000);
    }
}
</script>