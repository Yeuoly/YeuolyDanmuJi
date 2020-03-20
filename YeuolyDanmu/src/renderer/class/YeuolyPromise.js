/**
 * js原生的Promise不能完成我需要的一些功能，所以我觉得需要自己写一个
 */
class YeuolyPromise{
    

    resolve(result){

    };
    reject(error){

    };

    constructor( callback ){
       callback( this.resolve, this.reject );
    }

    then( callback ){
        
        return this;
    }

    catch(error){

    }

    final(){

    }
}