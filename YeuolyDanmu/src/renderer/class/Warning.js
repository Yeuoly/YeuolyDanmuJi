import { WarningEventBus } from '../events/evnetBus';

export default class Warning{
    constructor(block,message){
        this.block = block;
        this.message = message;
    }

    emit(){
        WarningEventBus.$emit('warning',`[${this.block}]:${this.message}`);
    }
}