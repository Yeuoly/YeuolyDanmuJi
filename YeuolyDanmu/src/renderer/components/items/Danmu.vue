<template>
    <div ref="holder" class="danmu-holder">
        <!-- <img v-for="i in Danmu.users.faces"
             :key="i"
             class="avatar" 
             :src="i"
        /> -->
        <div ref="text" class="danmu-text"> 
            <span>{{Danmu.user.id}}:</span> 
            <span :style="{ color : textColor }">
                <span v-html="Danmu.message"></span>
            </span> 
        </div>
    </div>
</template>

<script>

import { getAvatar } from '../../class/Avatar';

export default {
    name : 'Danmu',
    props : ['Danmu','text-color'],
    mounted() {
        //图片链接加载与图片预加载
        const tot_avt = this.Danmu.users.uids.length;
        let cur_avt = 0;
        this.Danmu.users.faces = [];
        this.Danmu.users.uids.forEach( e => {
            getAvatar(e, url => {
                this.Danmu.users.faces.push(url);
                const image = new Image();
                image.src = url;
                // //这里有个很鸡儿蛋疼的问题，v-for有时候会莫名失效，所以就手动添加了
                //不过u1s1这样写好不美观啊
                const node = document.createElement('img');
                node.src = url;
                node.className = 'avatar';
                this.$refs.holder.prepend(node);
                image.onload = () => {
                    cur_avt++;
                    if(cur_avt === tot_avt){
                        this.$emit('finishedLoadingAvatar');
                    }
                }
            });
        });
    },
    methods: {
    
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

.small-gift{
    width: 30px;
}
</style>