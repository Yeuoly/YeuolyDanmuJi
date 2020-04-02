/**
 * 第一次写插件系统，怪紧张的，试试看吧
 */

const fs = require('fs');
const path = require('path');
import Vue from 'vue';
import Axios from 'axios';
import Info from '../class/Info';
import HashList from '../class/HashList';
import { getAvatar } from '../class/Avatar';

export const plugins = [];
export const plugin_ids = [];

//创建插件接口，开放Vue接口
window.createPlugin = obj => {
    plugins.push(obj);
}
//获取事件
import { setListenner, removeListenner } from '../data/records_ipc';

const plugins_controller = {
    setListenner,
    removeListenner,
    Vue : Vue,
    helper : {
        HashList,
        getAvatar,
        console : Info,
        axios : Axios,
    }
}

//获取插件路径
import { global_settings } from '../settings/global_settings';
const plugins_path = global_settings['log_module']['plugins_path'];

function checkPlugin(e){
    const errors = [];
    if(typeof e.label !== 'string' || !e.label.match(/^[^\s]{2,20}$/g)){
        errors.push('label应该为一个string类型的长度在2~20之间的字符串（不含空字符）');
    }
    if(typeof e.name !== 'string' || !e.name.match(/^[a-zA-Z0-9]{3,20}$/g)){
        errors.push('name应该为一个string类型的长度在3~20之间的英文数字组合（不含空字符）');
    }
    if(typeof e.el_id !== 'string' || !e.el_id.match(/^[a-zA-Z0-9]{3,20}$/g)){
        errors.push('el_id应为一个string类型的长度在3~20之间的英文数字组合（不含空字符）');
    }
    if(typeof e.id !== 'number' || plugin_ids.includes(e.id)){
        errors.push('id应该为一个数字且不能与其他插件id重复');
    }else{
        plugin_ids.push(e.id);
    }
    if(typeof e.default_boot !== 'boolean'){
        errors.push('default_boot应该为一个布尔值');
    }
    if(typeof e.boot !== 'boolean'){
        errors.push('boot应该为一个布尔值');
    }
    if(typeof e.run !== 'function'){
        errors.push('run应该为一个函数');
    }
    if(typeof e.mount !== 'function'){
        errors.push('mount应该为一个函数');
    }
    if(errors.length === 0){
        Info.log('LOAD_PLUGINS',`插件【${e.label}】验证通过`,'green');
        return true;
    }else{
        Info.error('LOAD_PLUGINS',errors.join(' | '));
    }
}

function bootPlugins(){
    plugins.forEach( e => {
        if( checkPlugin(e) && e.default_boot){
            try{
                e.run(plugins_controller);
                Info.log('BOOT_PLUGINS',`插件【${e.label}】启动成功`,'green');
            }catch(e){
                Info.error('BOOT_PLUGINS', e.message + '<br />' + e.stack);
            }
        }
    });
}

function getPlugins(){
    fs.readdir(plugins_path, (err , files) => {
        if(err){
            fs.mkdir(plugins_path,() => {
                console.log(1);
            });
        }else{
            let total_count = 0;
            let loaded_count = 0;
            files.forEach( e => {
                //创建dom模拟加入js，我也很绝望啊，我能有什么办法啊，想了半天，可行的办法也就是通过全局变量来。。
                //import export这些关键词会在最后压缩的时候被砍掉，莫得办法啊
                const ext = path.extname(e);
                if(ext === '.js'){
                    total_count++;
                    const dom = document.createElement('script');
                    dom.onload = () => {
                        loaded_count++;
                        if(loaded_count === total_count){
                            bootPlugins();
                        }
                    }
                    dom.src = plugins_path + e;
                    document.body.appendChild(dom);
                }else if(ext === '.css'){
                    const dom = document.createElement('link');
                    dom.href = plugins_path + e;
                    dom.rel = 'stylesheet';
                    dom.type = 'text/css';
                    document.head.appendChild(dom);
                }
            });
        }
    });
}

if(require('electron').remote.getCurrentWindow().id === 1){
    getPlugins();
}