/**
 * 第一次写插件系统，怪紧张的，试试看吧
 */

const fs = require('fs');
const path = require('path');
import Vue from 'vue';
import Axios from 'axios';
import HashList from '../class/HashList';
import { getAvatar } from '../class/Avatar';

export const plugins = [];

//创建插件接口，开放Vue接口
window.createPlugin = obj => {
    plugins.push(obj);
}
//获取事件
import { setListenner, removeListenner } from '../data/logs';

const plugins_controller = {
    setListenner,
    removeListenner,
    Vue : Vue,
    helper : {
        HashList,
        getAvatar,
        console : console,
        axios : Axios,
    }
}

//获取插件路径
import { global_settings } from '../settings/global_settings';
const plugins_path = global_settings['log_module']['plugins_path'];

function bootPlugins(){
    plugins.forEach( e => {
        if(e.default_boot){
            e.run(plugins_controller);
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
                }
            });
        }
    });
}

if(require('electron').remote.getCurrentWindow().id === 1){
    getPlugins();
}