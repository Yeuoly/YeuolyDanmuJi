import { InfoEventBus } from '../events/evnetBus';
import Utils from './Utils';
const log = require('electron-log');

class Info{
    log(block,message,color){
        log.log({
            block : block,
            message : message,
        });
        InfoEventBus.$emit(
            'logger-insert',
            `[${Utils.formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')}][${block}]:${message}`,
            color || 'grey',
            'info'
        );
    }
    error(block,message){
        log.error({
            block : block,
            message : message,
        });
        InfoEventBus.$emit(
            'logger-insert',
            `[${new Date().format('yyyy-MM-dd hh:mm:ss')}][${block}]:${message}`,
            'red',
            'error'
        );
    }
    warning(block,message){
        log.warn({
            block : block,
            message : message,
        });
        InfoEventBus.$emit(
            'logger-insert',
            `[${new Date().format('yyyy-MM-dd hh:mm:ss')}][${block}]:${message}`,
            'orange',
            'warning'
        );
    }
}

export default new Info();