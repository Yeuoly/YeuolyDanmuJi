<template>
    <div class="block advance-settings">
        <p style="padding:0">
            <el-button type="primary" plain @click="openCourse">点这里看教程</el-button>
        </p>
        <span class="grey demonstration">日志保存路径，大部分数据都会保存在这里</span>
        <el-input type="text" v-model="origin['log_module']['log_path']"></el-input>
        <el-input placeholder="请输入" v-model.number="origin['log_module']['wirte_interval']">
            <template slot="prepend">日志保存间隔（s）</template>
        </el-input>
        <p class="demonstration grey">加载速度信息</p>
        <el-table :data="speed_list"
                  style="width : 100%"
                  stripe
        >
            <el-table-column label="速度" prop="NAME_CN" width="120"></el-table-column>
            <el-table-column label="实际速度(个/s)" prop="SPEED" width="160">
                <template slot-scope="{ $index }">
                    <el-input v-model.number="speed_list[$index]['SPEED']"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="最低礼物价值" prop="PRICE_MIN" width="160">
                <template slot-scope="{ $index }">
                    <el-input v-model.number="speed_list[$index]['PRICE_MIN']"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="最低辣条数量" prop="LATIAO_MIN" width="160">
                <template slot-scope="{ $index }">
                    <el-input v-model.number="speed_list[$index]['LATIAO_MIN']"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="加载延迟(ms)" prop="INTERVAL" width="160">
                <template slot-scope="{ $index }">
                    <el-input v-model.number="speed_list[$index]['INTERVAL']"></el-input>
                </template>
            </el-table-column>
        </el-table>
        <el-switch 
            active-text="启动礼物自动过滤"
            v-model="origin['loading_module']['auto_filt_low_gift']"
        ></el-switch>
        <el-input placeholder="请输入" v-model.number="origin['loading_module']['direct_trans_gift_min_line']">
            <template slot="prepend">能直接显示的最低礼物价值（瓜子）</template>
        </el-input> 
        <el-input placeholder="请输入" v-model.number="origin['loading_module']['danmu_temp_max_count']">
            <template slot="prepend">最大弹幕缓存数量</template>
        </el-input>
        <el-input placeholder="请输入" v-model.number="origin['loading_module']['gift_buffer_times']">
            <template slot="prepend">礼物缓存时间（ms）</template>
        </el-input>
        <el-input placeholder="请输入" v-model.number="origin['loading_module']['ordinary_max_price']">
            <template slot="prepend">常规礼物价值限（瓜子）</template>
        </el-input>
        <el-input placeholder="请输入" v-model.number="origin['loading_module']['host_server_index']">
            <template slot="prepend">服务器引索</template>
        </el-input>
        <p class="demonstration grey">显示模块</p>
        <el-switch 
            active-text="自动折叠重复弹幕" 
            v-model="origin['display_module']['auto_fold_repeat_danmu']"
        ></el-switch>
        <el-switch
            active-text="过滤超级礼物弹幕"
            v-model="origin['loading_module']['auto_filt_super_gift_danmu']"
        ></el-switch>
        <el-input placeholder="请输入" v-model.number="origin['display_module']['super_staying_time_each']">
            <template slot="prepend">SuperChat单次停留时间(s)</template>
        </el-input>
        <el-input placeholder="礼物用语" v-model.number="origin['display_module']['gift_greet']">
            <template slot="prepend">某某某</template>
            <template slot="append">233个辣条</template>
        </el-input>
        <el-button type="primary" style="width:100px;height:40px;margin-top:10px" plain @click="save">保存</el-button>
        <el-button type="danger" style="width:100px;height:40px;margin-top:10px" plain @click="init">重置</el-button>
    </div>
</template>

<script>
const ipc = require('electron').ipcRenderer;

import { global_settings , refreshSettings , setSettings , initSettings } from '../settings/global_settings';

export default {
    data : () => ({
        origin : global_settings,
        speed_list : global_settings['loading_module']['speed_list_info']
    }),
    methods: {
        save(){
            setSettings();
            //保存后要通知弹幕窗口更新
            ipc.send('to-danmu','refresh-settings');
        },
        init(){
            initSettings();
        },
        refresh(){
            refreshSettings();
        },
        openCourse(){
            require('electron').shell.openExternal('https://www.jianshu.com/p/89487ffc764a');
        }
    },
}
</script>

<style scoped>
    .advance-settings > *{
        padding-bottom: 5px;
        padding-top: 5px;
    }

    .grey{
        color: grey;
    }
</style>