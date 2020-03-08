<template>
    <div>
        <el-row>
            <el-col :span="12"
                    v-for="(i, key) in current_pages"
                    :key="key"
            >
                <SuperChat class="super-chat-records" :Danmu="i" v-if="i.type === 'super_chat'" />
                <Gift :Gift="i" v-else-if="i.type === 'gift'" />
            </el-col>
        </el-row>
        <el-row>
            <el-button-group>
                <el-button v-for="i in btn_pages" 
                           :key="i" 
                           v-show="i" 
                           plain
                           @click="jumpPage(i)"
                           size="small"
                >
                    {{i}}
                </el-button>
            </el-button-group>
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
        current_page : 1
    }),
    components : { SuperChat , Gift },
    methods: {
        loadResource(){
            if(this.$route.meta.type === 'gift'){
                this.resource = getDailyGiftRecordsPointer();
            }else if(this.$route.meta.type === 'sc'){
                this.resource = getDailySCRecordsPointer();
            }
        },
        jumpPage(page){
            this.current_page = page;
        }
    },
    computed: {
        is_sc(){
            return this.$route.meta.type === 'sc';
        },
        each_length(){
            return this.is_sc ? 8 : 30;
        },
        total_pages(){
            return parseInt(this.resource.length / this.each_length) + 1;
        },
        current_pages(){
            return this.resource.filter( ( e, i ) => {
                return  ( i >= ( this.current_page - 1 ) * this.each_length )
                    && ( i < ( this.current_page ) * this.each_length );
            });
        },
        btn_pages(){
            const pages = this.total_pages;
            const a = this.current_page;
            return [
                a - 2 < 0 ? null : 1,
                a - 2 > 1 ? a - 2 : null,
                a - 1 > 1 ? a - 1 : null,
                a,
                a + 1 < pages ? a + 1 : null,
                a + 2 < pages ? a + 2 : null,
                a + 2 > pages + 1 ? null : pages
            ];
        }
    },
    watch: {
        '$route.meta' : {
            handler(newVal){
                if(['gift','sc','log'].includes(newVal.type)){
                    this.loadResource();
                }else{
                    this.resource = [];
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