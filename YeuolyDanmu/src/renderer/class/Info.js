import { InfoEventBus } from '../events/evnetBus';

class Info{
    log(block,message,color){
        InfoEventBus.$emit(
            'logger-insert',
            `[${new Date().format('yyyy-MM-dd hh:mm:ss')}][${block}]:${message}`,
            color || 'grey',
            'info'
        );
    }
    error(block,message){
        InfoEventBus.$emit(
            'logger-insert',
            `[${new Date().format('yyyy-MM-dd hh:mm:ss')}][${block}]:${message}`,
            'red',
            'error'
        );
    }
    warning(block,message){
        InfoEventBus.$emit(
            'logger-insert',
            `[${new Date().format('yyyy-MM-dd hh:mm:ss')}][${block}]:${message}`,
            'orange',
            'warning'
        );
    }
}

export default new Info();