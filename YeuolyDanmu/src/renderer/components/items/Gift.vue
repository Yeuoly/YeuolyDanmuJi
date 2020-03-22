<template>
    <div class="gift" :style="{ backgroundColor : background_color }">
        <img class="avatar" :src="Gift.user.face">
        <div ref="text" class="danmu-text"> 
            <span>{{Gift.user.id}}：</span> 
            <span>
                {{Gift.message}}
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