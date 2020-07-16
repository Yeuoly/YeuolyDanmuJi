<template>
    <div>
        <el-row ref="master">
            <el-col :md="12" :sm="24" class="pb2">
                <el-input v-model.number="danmu_dialog.width">
                    <template slot="prepend">窗口宽度</template>
                </el-input>
            </el-col>
            <el-col :md="12" :sm="24" class="pb2">
                <el-input v-model.number="danmu_dialog.height">
                    <template slot="prepend">窗口高度</template>
                </el-input>
            </el-col>
            <el-col :md="12" :sm="24" class="pb2">
                <el-input v-model.number="danmu_dialog.pre_w">
                    <template slot="prepend">预设宽度</template>
                </el-input>
            </el-col>
            <el-col :md="12" :sm="24" class="pb2">
                <el-input v-model.number="danmu_dialog.pre_h">
                    <template slot="prepend">预设高度</template>
                </el-input>
            </el-col>
            <el-col :md="12" :sm="24" class="pt3">
                <el-button @click="loadDanmuDialogSize">重新加载</el-button>
                <el-button @click="loadPreSize">载入预设</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { remote } from 'electron';

const win = remote.getCurrentWindow();

export default {
    data : () => ({
        danmu_dialog : {
            width : 0,
            height : 0,
            pre_w : 0,
            pre_h : 0
        }
    }),
    watch: {
        'danmu_dialog' : {
            handler(v){
                win.setSize(v.width, v.height);
            },
            deep: true
        }
    },
    computed: {
        button_span(){
            return parseInt(this.$refs.master.offsetWidth / 100);
        }
    },
    methods: {
        loadDanmuDialogSize(){
            const getSize = () => {
                const size = remote.getCurrentWindow().getSize();
                this.danmu_dialog.width = size[0];
                this.danmu_dialog.pre_w = size[0];
                this.danmu_dialog.height = size[1];
                this.danmu_dialog.pre_h = size[1];
            }
            getSize();
        },
        loadPreSize(){
            this.danmu_dialog.width = this.danmu_dialog.pre_w;
            this.danmu_dialog.height = this.danmu_dialog.pre_h;
        }
    },
    mounted() {
        this.loadDanmuDialogSize();
    },
}
</script>

<style>

</style>