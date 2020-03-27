import Utils from './Utils';
import { addLog } from '../data/logs';
const log = require('electron-log');

function getDate(){
    return Utils.formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
}

class Info{
    log(block,message,color){
        log.log({
            block : block,
            message : message,
        });
        addLog(
            `[${getDate()}][${block}]:${message}`,
            color || 'grey',
            'info'
        );
    }
    error(block,message){
        log.error({
            block : block,
            message : message,
        });
        addLog(
            `[${getDate()}][${block}]:${message}`,
            'red',
            'error'
        );
    }
    warning(block,message){
        log.warn({
            block : block,
            message : message,
        });
        addLog(
            `[${getDate()}][${block}]:${message}`,
            'orange',
            'warning'
        );
    }
}

export default new Info();