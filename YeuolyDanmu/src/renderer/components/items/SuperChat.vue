<template>
    <div class="superchat">
        <div :style="{ backgroundColor : Danmu.background_color ,
                       backgroundImage : 'url(' + Danmu.background_image + ')' ,
                       color : Danmu.price_color, fontFamily: font }" 
            class="superchat-title"
        >  
            <img :src="Danmu.user.face" class="sc-avatar">
            <span class="sc-uname" :style="{ fontFamily: font }"> {{ Danmu.user.id }} </span> 
            <span class="sc-price" :style="{ fontFamily: font }"> ￥：{{ Danmu.price }} </span>
        </div>
        <div :style="{ backgroundColor : Danmu.background_color_bottom, fontFamily: font }" 
            class="superchat-info"
        >{{ Danmu.message }}
        </div>
    </div>
</template>

<script>
export default {
    name : 'SuperChat',
    props : ['Danmu','font']
}
</script>

<style scoped>
.superchat-title{
    height: 80px;
    font-family: 'DanmuFont';
    font-size: 20px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 130%;
}
.sc-avatar{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    padding: 5px;
    float: left;
    transform: translateY(10px);
}
.sc-uname{
    display: block;
    height: 20px;
    transform: translateY(18px);
}
.sc-price{
    display: block;
    transform: translateY(25px);
}
.superchat-info{
    line-height: 1;
    padding: 3px;
    border-radius: 0px 0px 5px 5px;
    color: white;
    font-family: 'DanmuFont';
}
</style>