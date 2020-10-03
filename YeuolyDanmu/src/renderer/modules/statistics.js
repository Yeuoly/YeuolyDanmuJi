/**
 * 用来做统计的吧，每次启动开始统计
 */

import md5 from 'md5';
import axios from 'axios';
import api from '../settings/api';
import Info from './Info';
import { stringify } from 'querystring';
import { getStorage, modifyStorage } from './Store';

/**
 * {
 *      user_key: md5(md5(String(time()) + rand() + new ))
 * }
 * 用于统计用户活跃度，key是一个自己生成在本地的变量，一个全新的弹幕姬会生成一个全新的key，只要之后
 * 不删除配置文件，这个key都默认存在，可以把key和用户账号进行绑定，只不过统一登陆系统还没有完全做好
 */
export const launchStatistics = async () => {
    let key = getStorage('user_key', null);
    if(!key){
        key = md5(new Date().getSeconds().toString() + Math.random() * 8081 + Math.random() * 3294);
        modifyStorage('user_key', key);
    }
    try{
        const { data } = await axios.post(api.yeuoly_account_sign, stringify({sign : key}));
        if(typeof data === 'string'){
            Info.error('Statistics', data);
        }else{
            if(data['data']['res'] === 0){
                Info.log('Statistics', '统计模块执行成功','green');
            }else{
                Info.error('Statistics', data['data']['error']);
            }
        }
    }catch(e){
        Info.error('Statistics', e);
    }
}

export const getLastVersion = async () => new Promise(async resolve => {
    try{
        const { data } = await axios.post(api.yeuoly_versions, stringify({sign : 27}));
        Info.log('Statistics','获取版本信息成功','green');
        resolve(data);
    }catch(e){
        Info.error('Statistics','获取版本信息失败');
        resolve(false);
    }
});