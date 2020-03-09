<template>
    <div class="gift" :style="{ backgroundColor : background_color }">
        <img class="avatar" :src="Gift.user.face">
        <div ref="text" class="danmu-text"> 
            <span>{{Gift.user.id}}:</span> 
            <span>
                赠送了{{Gift.gift_num}}个{{Gift.gift_name}}
                <img class="small-gift" :src="Gift.gift_image">
            </span> 
        </div>
    </div>
</template>

<script>
export default {
    name : 'Gift',
    props : ['Gift'],
    computed: {
        background_color(){
            const p = this.Gift.gift_price;
            if(this.Gift.gift_id === 1 ){
                if(p < 50000){
                    return '#2A60B2';
                }else{
                    return '#E09443';
                }
            }else{
                if(p < 9900){
                    return '#E9967A';
                }else if(p < 20000){
                    return '#FA8072';
                }else if(p < 50000){
                    return '#FFA07A';
                }else if(p < 100000){
                    return '#FFA500';
                }else if(p < 200000){
                    return '#FF8C00';
                }else{
                    return '#FF7F50';
                }
            }
        }
    },
}
</script>

<style>
    .gift{
        border-radius: 20px;
        /* background-color: white; */
        margin-bottom: 5px;
        margin-right: 15px;
    }

    .avatar{
        width: 25px;
        height: 25px;
        border-radius: 50%;
        padding: 5px;
        float: left;
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

    .small-gift{
        height: 25px;
    }
</style>