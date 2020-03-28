<template>
    <div class="py3 lr-sc">
        <img class="lr-sc-face" :src="face" />
        <div class="lr-sc-id" v-html="uname"></div>
        <div class="lr-sc-status" :class="{ free : !live_status }">{{status}}</div>
        <div class="lr-sc-roomid">房间号：{{room_id}}</div>
    </div>
</template>

<script>
export default {
    name : 'LiveRoomShortcut',
    props : ['room_id','uname','face','live_status'],
    computed: {
        status(){
            return this.live_status ? '直播中' : '未开播';
        }
    },
}
</script>

<style>
    .lr-sc{
        position: relative;
    }

    .lr-sc-face{
        float: left;
        width: 50px;
        border-radius: 50%;
    }

    .lr-sc-id{
        float: left;
        margin-top: -2px;
        margin-bottom: 4px;
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-left: 20px;
    }

    .lr-sc .lr-sc-id .keyword{
        color: #f25d8e;
    }

    .lr-sc .lr-sc-status{
        display: inline-block;
        margin-bottom: px;
        padding: 0 3px;
        line-height: 1.5;
        border-radius: 4px;
        color: #fff;
        background-color: greenyellow;
        margin-left: 5px;
        font-size: 12px;
    }
    .lr-sc .lr-sc-id em{
        font-style: normal;
        font-weight: 400;
    }
    .lr-sc .free{
        background-color: #878787 !important;
    }
    .lr-sc .lr-sc-roomid{
        position: absolute;
        font-size: 11px;
        /* margin-left: -5px; */
        left: 75px;
        top: 25px;
    }
</style>