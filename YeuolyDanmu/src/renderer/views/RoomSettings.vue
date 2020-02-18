<template>
    <div>
        <el-input style="background-color:transparent;" placeholder="房间号" v-model.number="room_id">
            <el-button style="background-color:transparent" slot="append">保存</el-button> 
        </el-input>
    </div>
</template>

<script>
export default {
    name : 'RoomSettings',
    data : () => ({
        room_id : 1534600,
    }),
    methods: {
        setRoomID(){
            this.$store.dispatch('SET_ROOM_ID',this.room_id);
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