<template>
    <div>
        <el-input style="background-color:transparent;" placeholder="房间号" v-model.number="room_id">
            <el-button style="background-color:transparent"
                :loading="room_id_lock"
                :disabled="!room_id" 
                slot="append" 
                @click="setRoomID"
            >保存</el-button> 
        </el-input>
    </div>
</template>

<script>
export default {
    name : 'RoomSettings',
    data(){
        return {
            room_id : this.$store.getters.getRoomID,
            room_id_lock : false
        }
    },
    methods: {
        setRoomID(){
            this.room_id_lock = true;
            this.$store.dispatch('SET_ROOM_ID',this.room_id);
            setTimeout(() => {
                this.room_id_lock = false;
            },500);
        }
    },
}
</script>

<style>
    .el-input-group__append{
        background-color: transparent !important;
    }

    .el-input__inner{
        background-color: transparent !important;
    }
</style>