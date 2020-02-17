class Info{
    log(block,message){
        console.log(`[${new Date().format('yyyy-MM-dd hh:mm:ss')}][${block}]:${message}`);
    }
    error(block,message){
        console.error(`[${new Date().format('yyyy-MM-dd hh:mm:ss')}][${block}]:${message}`);
    }
}

export default new Info();