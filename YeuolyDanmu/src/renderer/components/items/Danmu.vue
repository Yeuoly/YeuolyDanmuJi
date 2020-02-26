<template>
    <div ref="holder" class="danmu-holder">
        <img class="avatar" :src="Danmu.user.face"/>
        <div ref="text" class="danmu-text"> 
            <span>{{Danmu.user.id}}:</span> 
            <span :style="{ color : textColor }">{{Danmu.message}}</span> 
        </div>
    </div>
</template>

<script>

import { getAvatar } from '../../class/Avatar';

export default {
    name : 'Danmu',
    props : ['Danmu','text-color'],
    beforeMount() {
        //图片链接加载与图片预加载
        getAvatar(this.Danmu.user.uid, url => {
            this.Danmu.user.face = url;
            const image = new Image();
            image.src = url;
            image.onload = () => {
                this.$emit('finishedLoadingAvatar');
            }
        });
    },
    methods: {
        move(){
            //老版处理，太卡了，改用群体transform
            //新增弹幕的动画处理
            // const height = window.getComputedStyle(this.$refs.text)['height'];
            // this.$refs.holder.style.height = Number(height.substr(0,height.length - 2)) + 6 + 'px';
        },
    },
}
</script>

<style>

.danmu-holder{
    display: block;
    /* height: 0; 老版处理 */
    transition: all .2s;
    overflow: hidden;
}

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

</style>