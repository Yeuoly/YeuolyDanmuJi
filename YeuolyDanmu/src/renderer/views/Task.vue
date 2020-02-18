<template>
    <div>
        <el-row>
            <el-col :span="4">
                <el-button 
                    type="primary" 
                    plain 
                    @click="startDanmuLoader" 
                    :disabled="started" 
                    :loading="starting"
                >
                    启动弹幕姬
                </el-button>
            </el-col>
            <el-col :span="4">
                <el-button 
                    type="danger" 
                    plain   
                    @click="closeDanmuLoader" 
                    :disabled="!started"
                    :loading="closing"
                >
                    关闭弹幕姬
                </el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Loader from '../class/DanmuLoader';

export default {
    name : 'Task',
    data : () => ({
        DanmuLoader : new Loader(1534600),
        started : false,
        starting : false,
        closing :false
    }),
    methods: {
        startDanmuLoader(){
            this.starting = true;
            const room_id = this.$store.getters.getRoomID;
            this.DanmuLoader.setRoomID(room_id);
            this.DanmuLoader.startLoader(() => {
                this.starting = false;
                this.started = true;
            });
        },
        closeDanmuLoader(){
            this.closing = true;
            this.DanmuLoader.closeDanmuLoader(() => {
                this.closing = false;
                this.started = false;
                this.starting = false;
            });
        }
    },
}
</script>

<style>
    .el-button{
        background-color: transparent !important;
        border-color: white !important;
    }
</style>