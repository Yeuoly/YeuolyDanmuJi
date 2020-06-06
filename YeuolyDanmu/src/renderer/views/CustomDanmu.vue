<template>
    <el-row>
        <el-col :span="24">
            <div style="width:100%;height:95px">
                <div class="display" v-for="(i, key) in danmu_decoration_groups" :key="key">
                    <CustomDanmuItem :decoration="i" :danmu="test_danmu" />
                </div>
            </div>
        </el-col>
        <el-col :span="18">
            <div ref="drawer" id="drawer">
                <div v-for="(i, key) in current_danmu_decoration" :key="key" style="width:100%;height:100%">
                    <div v-if="i.type === 'message'" class="message" :style="i.css || ''" v-drag-move="i.options" v-focus>
                        {{ test_danmu.message }}
                    </div>
                    <div v-else-if="i.type === 'face'" class="message" :style="i.css || ''" v-drag-move="i.options">

                    </div>
                    <div v-else-if="i.type === 'medal'" class="message" :style="i.css || ''" v-drag-move="i.options"></div>
                    <div v-else-if="i.type === 'ul'" class="message" :style="i.css || ''" v-drag-move="i.options"></div>
                    <div v-else-if="i.type === 'guard'" class="message" :style="i.css || ''" v-drag-move="i.options"></div>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import Store from 'electron-store';
import CustomDanmuItem from '../components/items/CustomDanmuItem';
const store = new Store();

export default {
    name : 'CustomDanmu',
    components : { CustomDanmuItem },
    data : () => ({
        current_danmu_decoration : [{
            css : '',
            type : 'message',
            options : {
                position : { x : 0, y : 0 },
                options : {
                    size : { width : 100, height: 30 }
                }
            }
        }],
        danmu_decoration_groups : [],
        test_danmu : {
            user : {
                id : 'Yeuoly',
                uid : 40691233,
                face : 'http://i0.hdslb.com/bfs/face/19713e1645829c332240dc05cfdb761a93030f8b.jpg',
            },
            medal : {
                lv : 8,
                medal_name : '沙月',
                up_name : '沙月ちゃん',
                up_uid : 128912828
            },
            message : '这是测试弹幕',
            guard_type : 3
        }
    }),
    methods: {
        loadStoredDecoration(){
            const groups = store.get('danmu-decoration-groups',[]);
            this.danmu_decoration_groups = [[
                {
                    css : '',
                    type : 'message',
                    options : {
                        position : { x : 0, y : 0 },
                        size : { width : 100, height : 40 }
                    }
                }
            ],...groups];
        }
    },
    mounted() {
        this.loadStoredDecoration();
    },
}
</script>

<style scoped>
    .display{
        background-color:#e0e0e0; 
        height:85px;
        width: 120px;
    }

    #drawer{
        width: 100%;
        height: 400px;
        margin: 0 auto;
        background-color: #e0e0e0;
    }

    .message{
        user-select: none;
    }

</style>