<template>
    <el-row>
        <el-dialog title="CSS编辑"
                   :visible.sync="css_editor.visible"
        >
            EDITOR
        </el-dialog>
        <el-col :span="24">
            <div style="width:100%;height:95px;">
                <div class="display" v-for="(i, key) in danmu_decoration_groups" :key="key">
                    <CustomDanmuItem :decoration="i" :danmu="test_danmu" />
                </div>
            </div>
        </el-col>
        <el-col :span="18">
            <div ref="drawer" id="drawer" class="w100">
                <div class="h100">
                    <div v-for="(i, key) in current_danmu_decoration" :key="key" 
                         class="message"
                         v-drag-move="i.options"
                         v-drag-resize="i.options"
                         v-focus="{ index : i.options.index, event : focus }"
                         
                    >
                        <div class="hover" :style="i.css || ''" v-if="i.type === 'message'">
                            {{ test_danmu.message }}
                        </div>
                        <div class="hover" :style="i.css || ''" v-else-if="i.type === 'face'">
                            
                        </div>
                        <div class="hover" :style="i.css || ''" v-else-if="i.type === 'medal'">
                            
                        </div>
                        <div class="hover" :style="i.css || ''" v-else-if="i.type === 'ul'">
                            
                        </div>
                        <div class="hover" :style="i.css || ''" v-else-if="i.type === 'guard'">
                            
                        </div>
                        <div class="hover broad" :style="i.css || ''" v-else-if="i.type === 'backbroad'">
                        </div>
                    </div>
                </div>
            </div>
        </el-col>
        <!-- 
            这里是右边的属性界面
        -->
        <el-col :span="6" style="height: 400px">
            <div id="attribute-board" class="h100 px2 text-grey">
                <div class="w100 h100" v-if="attributes.current">
                    <el-row>
                        <el-col :span="24">
                            <span class="text-13 pb2">坐标/尺寸</span>
                        </el-col>
                        <el-col :span="24">
                            <el-row>
                                <el-col :span="3">
                                    <div class="text-left">x : </div>
                                </el-col>
                                <el-col :span="9">
                                    <input class="attributes-editor" v-model.number="attributes.current.options.options.position.x" />
                                </el-col>
                                <el-col :span="3">
                                   <div class="text-right">y : </div>
                                </el-col>
                                <el-col :span="9">
                                    <input class="attributes-editor" v-model.number="attributes.current.options.options.position.y" />
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="24" class="pt4">
                            <el-row>
                                <el-col :span="3">
                                    <div class="text-left">w : </div>
                                </el-col>
                                <el-col :span="9">
                                    <input class="attributes-editor" v-model.number="attributes.current.options.options.size.width" />
                                </el-col>
                                <el-col :span="3">
                                   <div class="text-right">h : </div>
                                </el-col>
                                <el-col :span="9">
                                    <input class="attributes-editor" v-model.number="attributes.current.options.options.size.height" />
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="24">
                            <div class="text-13 pt4">css/动画</div>
                        </el-col>
                        <el-col :span="24" class="pt2">
                            <div id="attributes-style-header">
                                <i class="el-icon-plus text-12 clickable" title="添加新属性" @click="addNewCss"></i>
                                <div v-for="( e, key ) in attributes.current.css" :key="key">
                                    {{key}} : {{e}}
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div v-else>
                    未选中目标
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import Store from 'electron-store';
import CustomDanmuItem from '../components/items/CustomDanmuItem';
import { MessageBox } from 'element-ui';
const store = new Store();

export default {
    name : 'CustomDanmu',
    components : { CustomDanmuItem },
    data : () => ({
        css_editor : {
            visible : false
        },
        current_danmu_decoration : [{
            css : {
                backgroundColor : 'rgba(0,0,0,0.1)'
            },
            type : 'backbroad',
            options : {
                options : {
                    position : { x : 0, y : 0, immediate : true },
                    size : { width : 625, height: 400, immediate : true }
                },
                index : 0
            }
        },{
            css : {},
            type : 'message',
            options : {
                options : {
                    position : { x : 0, y : 0, immediate : true },
                    size : { width : 100, height: 30, immediate : true }
                },
                index : 1
            }
        }],
        attributes : {
            current : null,
        },
        current_attribute_index : 0,
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
    watch: {
        'attributes' : {
            handler(v){
                
            },
            immediate : true,
            deep : true
        }
    },
    methods: {
        loadStoredDecoration(){
            const groups = store.get('danmu-decoration-groups',[]);
            this.danmu_decoration_groups = [[
                {
                    css : {},
                    type : 'message',
                    options : {
                        position : { x : 0, y : 0 },
                        size : { width : 100, height : 40 }
                    }
                }
            ],...groups];
        },
        focus(event, index){
            if(event === 'focus'){
                for(let i of this.current_danmu_decoration){
                    if(i.options.index === index){
                        this.attributes.current = i;
                    }
                }
            }
        },
        addNewCss(){
            this.css_editor.visible = true;
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
        height: 400px;
        margin: 0 auto;
        background-color: #ffffff;
        background-image: linear-gradient(0deg, transparent 0, grey 1px, transparent 1px),linear-gradient(90deg, transparent 0, grey 1px, transparent 1px);
        background-size: 48px 40px;
        border-top: 1px solid rgba(0,0,0,0.01);
    }

    #attribute-board{
        
    }

    .attributes-editor{
        border-top: 0;
        border-left: 0;
        border-right: 0;
        border-color: lightgrey;
        border-bottom-width: 1px;
        transition: all .2s;
        width: 100%;
    }

    .attributes-editor:focus{
        outline: none;
        border-bottom-color: #409EFF;
    }

    .message{
        user-select: none;
    }

    .broad{
        background-color: rgba(0, 0, 0, 0.1);
    }

    .hover{
        width: 100%;
        height: 100%;
    }
</style>