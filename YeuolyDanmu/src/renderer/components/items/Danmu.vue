<template>
    <div ref="holder" class="danmu-holder">
        <img v-for="( i, key ) in Danmu.users.faces"
             :key="key"
             class="avatar" 
             :src="i.src"
             :guard="i.guard"
        />
        <div ref="text" class="danmu-text" :style="{ fontFamily : font }" > 
            <span :style="{ color : unameColor }">{{Danmu.user.id}}：</span> 
            <span :style="{ color : textColor }">{{Danmu.message}}</span> 
        </div>
    </div>
</template>

<script>
export default {
    name : 'Danmu',
    props : ['Danmu','text-color','uname-color','font'],
    /**
     * 原本这里有一堆预加载，现在我把预加载挪出去了，这玩意太卡了
     */
}
</script>