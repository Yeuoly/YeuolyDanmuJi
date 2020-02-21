<template>
    <div class="color-group">
        <div v-for="( color , key ) in $attrs.value"
             :key="key"
             class="color-block"
             :style="{ backgroundColor : color }"
             @click="deleteColor(key)"
        ></div>
    </div>
</template>

<script>
export default {
    name : 'ColorGroup',
    model : {
        name : 'hostValue',
        event : 'change',
    },
    props : ['disabled'],
    data : () => ({
        
    }),
    methods: {
        deleteColor(key){
            if(this.disabled)return;
            let deleted = this.$attrs.value.slice(0);
            deleted.splice(key,1);
            this.$emit('change',deleted);
        }
    },
}
</script>

<style scoped>
    .color-group{
        overflow: auto;
        height: 25px;
        float: left;
        width: 160px;
    }

    .color-block{
        cursor: pointer;
        float: left;
        width: 10px;
        height: 25px;
    }

    .color-block:hover{
        box-shadow: 0 0 5px #333;
    }
</style>