<template>
    <div>
        <el-row>
            <el-col :span="12"
                    v-for="(i, key) in resource"
                    :key="key"
            >
                <SuperChat class="super-chat-records" :Danmu="i" v-if="i.type='super_chat'" />
                <Gift :Gift="i" v-else-if="i.type='gift'" />
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getDailyLogRecordsPointer, getDailyGiftRecordsPointer, getDailySCRecordsPointer } from '../data/logs';
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
    watch: {
        '$route.meta' : {
            handler(newVal){
                if(['gift','sc','log'].includes(newVal.type)){
                    this.loadResource();
                }
            },
            immediate : true
        }
    },
}
</script>

<style scoped>
.super-chat-records{
    padding: 8px;
    width: 350px;
}
</style>