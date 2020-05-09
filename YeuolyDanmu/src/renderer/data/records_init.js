import Utils from '../class/Utils';
import Info from '../class/Info';
import { global_settings } from '../settings/global_settings';

const fs = require('fs');
const log = require('electron-log');

const base_path = `${global_settings['log_module']['log_path']}records\\`;
const recd_path = `${base_path}daily\\`;
const logs_path = `${base_path}logs\\`;
const filename = `${recd_path}${Utils.formatDate(new Date(),'yyyy-MM-dd-hh')}.yson`;

if(require('electron').remote.getCurrentWindow().getTitle() === '主窗口'){
    //创建基础文件夹
    fs.mkdir(base_path,{ recursive: true },() => {});
    fs.mkdir(recd_path,() => {});
    fs.mkdir(logs_path,() => {});

    //electron-log配置
    log.transports.console.level = false;
    log.transports.file.file =  `${base_path}logs\\${Utils.formatDate(new Date(),'yyyy-MM-dd-hh')}.log`;
    log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";
}


export default {
    /**
     * 写入数据
     * @param {string} 需要输出的日志信息 
     */
    log(str){
        fs.appendFile(filename,str + '\n',{ encoding: 'utf8' }, err => {
            if(err){
                Info.error('WRITE_RECORDS','写入记录失败:' + err);
            }
        });
    }
}
