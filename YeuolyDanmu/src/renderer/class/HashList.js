import md5 from 'md5';

const dict = { '0':0, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, 'a':10, 'b':11, 'c':12, 'd':13, 'e':14, 'f':15 };

/**
 * @class
 * 还是感觉自己算法太菜了，写个hashlist都写得这么累
 * 就是个简单的hashList，其实就是模仿数据库的快速检索，可以指数级地减少检索计算量，如果数据量不大的话还是不建议使用这个的
 */
export default class HashList{
    list = [];
    offset = 0;

    pushArray(e,offset){
        for(let i = 0; i < 16; i++){
            e.push([]);
            if(offset - 1 > 0){
                this.pushArray(e[i],offset - 1);
            }
        }
    }

    /**
     * @param {*} offset 这个玩意建议填1或者2 如果数据量越大建议用更大的，比如说10^4这个级别的数据用2就行了，10^5就得3了，不建议少数据量用大了，会造成性能损耗 
     */
    constructor(offset){
        this.offset = offset || 1;
        this.pushArray(this.list,this.offset);
    }

    /**
     * @param {*} item 对象
     * @param {*} item_sign 这个对象的唯一标识 
     * @returns {*} true是插入成功 false是之前已经存在
     */
    insert(item,item_sign){
        const hash = md5(item_sign);
        if(!this.find(hash)){
            this.set(hash,item);
            return true;
        }
        return false;
    }

    /**
     * @param {*} item_sign 对象唯一标识
     */
    get(item_sign){
        const hash = md5(item_sign);
        return this.find(hash);
    }

    change(){
        /**
         * 现在懒得写，逻辑没想好
         */
    }

    /**
     * @param {*} hash
     */
    find(hash){
        return this.getByOffsetRecursion(this.list,hash);
    }

    set(hash,value){
        this.setByOffsetRecursion(this.list,hash,value);
    }

    /**
     * 这个玩意是用来递归多维hash表用的，最多有16层递归（？
     * @param {*} parent 父级对象，此次递归中的操作都在这完成
     * @param {*} hash hash值
     * @param offset 偏移值，如果没达到指定偏移量就到下一层去，到了就在本层开始找
     * @returns {*} 如果是null就是不存在，如果是对象就存在
     */
    getByOffsetRecursion(parent,hash,offset){
        offset = offset || 1;
        if(offset === this.offset){
            for(let i in parent){
                if(parent[i][0] === hash){
                    return parent[i][1];
                }
            }
            return null;
        }else{
            return this.getByOffsetRecursion(parent[dict[hash[offset - 1]]],hash,offset + 1);
        }
    }

    /**
     * 同上
     */
    setByOffsetRecursion(parent,hash,value,offset){
        offset = offset || 1;
        if(offset === this.offset){
            parent[dict[hash[offset - 1]]] = [ hash , value ];
        }else{
            console.log(hash);
            this.setByOffsetRecursion(parent[dict[hash[offset - 1]]],hash,value,offset + 1);
        }
    }
}