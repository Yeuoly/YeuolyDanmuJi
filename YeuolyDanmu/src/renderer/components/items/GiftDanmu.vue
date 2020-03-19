<template>
    <div ref="holder" class="danmu-holder">
        <img class="avatar" 
             :src="Gift.user.face"
             :guard="Gift.guard"
        />
        <div ref="text" class="danmu-text" :style="{ fontFamily : font }" > 
            <span :style="{ color : unameColor }">{{Gift.user.id}}:</span> 
            <span :style="{ color : textColor }">
                <span>
                    {{Gift.message}}
                    <img class="small-gift" :src="Gift.gift_image">
                </span>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name : 'GiftDanmu',
    props : ['Gift','unameColor','textColor','font']
}
</script>