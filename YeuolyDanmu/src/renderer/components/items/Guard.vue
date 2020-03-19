<template>
   <div style="padding:5px">
        <div class="guard-msg" :style="{ fontFamily: font }">
            <img class="guard-avatar" :src="Guard.user.face" />
            <img class="guard-img" :src="Guard.img"/>
            <p class="guard-text">{{Guard.user.id}}开通了{{Guard.name}}</p>
            <p class="guard-price"><i class="gold-seed"></i>{{Guard.price}}</p>
        </div>
    </div>
</template>

<script>
export default {
    name : 'Guard',
    props : ['Guard','font']
}
</script>