export default class Info{
    log(block,message){
        console.log(`[${block}]:${message}`);
    }
    error(block,message){
        console.error(`[${block}]:${message}`);
    }
}