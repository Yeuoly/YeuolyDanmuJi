<template>
    <div :class="{ hidden : hidden }">
        <img class="avatar" :src="Danmu.user.face" />
        <span class="danmu-text">{{Danmu.user.id}}:{{Danmu.message}}</span>
    </div>
</template>

<script>

import { getAvatar } from '../../class/Avatar';

export default {
    name : 'Danmu',
    props : ['Danmu','parent'],
    data : () => ({
        hidden : true
    }),
    beforeMount() {
        //图片链接加载与图片预加载
        getAvatar(this.Danmu.user.uid, url => {
            this.Danmu.user.face = url;
            const image = new Image();
            image.src = url;
            image.onload = () => {
                this.hidden = false;
            }
        });
    },
    watch : {
        hidden(v){
            if(!v){
                this.parent.scrollTop = this.parent.scrollHeight;
            }
        }
    }
}
</script>

<style>

.danmu-text{
    font-size: 22px;
    font-family: 'DanmuFont';
    display: block;
    color: white;
    font-weight: 600;
    text-shadow: 0px 0px 6px black;
    padding: 3px;
    letter-spacing: 1px;
    line-height: 1.6;
    /* -webkit-text-stroke: 0.2px black; */
}

.avatar{
    width: 25px;
    height: 25px;
    border-radius: 50%;
    padding: 5px;
    float: left;
}

.hidden{
    display: none;
}
</style>