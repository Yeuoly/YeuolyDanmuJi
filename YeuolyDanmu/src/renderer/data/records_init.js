import Utils from '../class/Utils';
import { global_settings } from '../settings/global_settings';

const log = require('electron-log');
log.transports.console.level = false;
/**
 * 写着一段的时候我自己都很懵，大概思路，每次保存日志文件都是保存在下面这个鬼文件里，文件名为启动时间
 * 每次写入记录都是 【时间】+【类别】+【文本】这样的格式
 * 每次写入只写入新增记录，具体实现看底下叭，就算写的时候很懵很乱，这点逻辑应该还是很容易看懂的
 */
log.transports.file.file =  `${global_settings['log_module']['log_path']}records\\${Utils.formatDate(new Date(),'yyyy-MM-dd-hh')}.txt`;
log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";
