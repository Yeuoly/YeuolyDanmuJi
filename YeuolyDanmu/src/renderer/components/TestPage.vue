<template>
    <div class="test">
        <div v-for="(i ,key) in danmus" :key="key" >
            {{ i }}
        </div>
    </div>
</template>

<script>
import { DanmukuEventBus } from '../events/evnetBus';

export default {
    name : 'test',
    data : () => ({
        danmus : []
    }),
    methods: {
        add(item){
            this.danmus.push(item);
        }
    },
    mounted() {
        DanmukuEventBus.$on('on-add',this.add);
    }
}
</script>