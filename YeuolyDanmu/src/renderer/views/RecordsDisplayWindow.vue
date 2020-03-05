<template>
    <div>
        <div v-for="(i, key) in resource"
             :key="key"
        >
            <SuperChat :Danmu="i" v-if="i.type='super_chat'" />
            <Gift :Gift="i" v-else-if="i.type='gift'" >
        </div>
    </div>
</template>

<script>
import { getDailyLogRecordsPointer, getDailyGiftRecordsPointer, getDailySCRecordsPointer } from '../data/settings';
import SuperChat from '../components/items/SuperChat';
import Gift from '../components/items/Gift';

export default {
    data : () => ({
        resource : null,
    }),
    components : { SuperChat , Gift },
    methods: {
        loadResource(){
            if(this.$route.meta.type === 'log'){
                this.resource = getDailyLogRecordsPointer();
            }else if(this.$route.meta.type === 'gift'){
                this.resource = getDailyGiftRecordsPointer();
            }else if(this.$route.meta.type === 'sc'){
                this.resource = getDailySCRecordsPointer();
            }
        }
    },
}
</script>