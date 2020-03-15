<template>
    <div ref="holder" class="danmu-holder">
        <img v-for="( i, key ) in Danmu.users.faces"
             :key="key"
             class="avatar" 
             :src="i.src"
             :guard="i.guard"
        />
        <div ref="text" class="danmu-text" :style="{ fontFamily : font }" > 
            <span :style="{ color : unameColor }">{{Danmu.user.id ? Danmu.user.id + ':' : ''}}</span> 
            <span :style="{ color : textColor }">
                <span v-html="Danmu.message"></span>
            </span> 
        </div>
    </div>
</template>

<script>

// import { getAvatar } from '../../class/Avatar';

export default {
    name : 'Danmu',
    props : ['Danmu','text-color','uname-color','font'],
    /**
     * 原本这里有一堆预加载，现在我把预加载挪出去了，这玩意太卡了
     */
}
</script>

<style>

.danmu-holder{
    display: block;
    /* height: 0; 老版处理 */
    transition: all .2s;
    overflow: hidden;
}

.gold-seed{
    background-position: 0 -35em;
    width: 1em;
    height: 1em;
    font-size: 24px;
    vertical-align: middle;
    display: inline-block;
    background-image: url(//s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/svg-sprite.e15d8c3.svg);
    background-repeat: no-repeat;
    background-size: 1em 116em;
    margin-top: -4px;
    padding-right: 2px;
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
    background-size: cover;
    background-position: 0 2px;
    background-repeat: no-repeat;
}

.small-gift{
    width: 25px;
}

.avatar[guard="1"]{
    background-image: url(//s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/guard-border-1.5823fce.png);    
}

.avatar[guard="2"]{
    background-image: url(//s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/guard-border-2.fb413fb.png);
}

.avatar[guard="3"]{
    background-image: url(//s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/guard-border-3.26018c5.png);
}

.guard-msg{
    width: calc(100% - 20px);
    padding: 10px;
    height: 70px;
    overflow: hidden;
    position: relative;
    background-color: cadetblue;
    border-radius: 5px;
    font-size: 17px;
    /* border-right: 5px; */
}

.guard-avatar{
    position: absolute;
    width: 70px;
    border-radius: 50%;
    left: 5px;
}

.guard-text{
    position: absolute;
    left: 85px;
    top: -5px;
    line-height: 1.2;
    word-break: break-all;
    padding-right: 4px;
}

.guard-price{
    position: absolute;
    right: 10px;
    bottom: -13px;
}

.guard-img{
    width: 84px;
    position: absolute;
    left: -2px;
    top: 2px;
}
</style>