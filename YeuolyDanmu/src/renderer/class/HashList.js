import md5 from 'md5';
import Utils from '../class/Utils';

const dict = { '0':0, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, 'a':10, 'b':11, 'c':12, 'd':13, 'e':14, 'f':15 };

/**
 * @class
 * 还是感觉自己算法太菜了，写个hashlist都写得这么累
 * 就是个简单的hashList，其实就是模仿数据库的快速检索，可以指数级地减少检索计算量，如果数据量不大的话还是不建议使用这个的
 */
class BaseHashList{
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
     * @param {number} offset 这个玩意建议填1或者2 如果数据量越大建议用更大的，比如说10^4这个级别的数据用2就行了，10^5就得3了，不建议少数据量用大了，会造成性能损耗 
     */
    constructor(offset){
        this.offset = offset || 1;
        this.pushArray(this.list,this.offset);
    }

    clear(){
        this.list = [];
        this.pushArray(this.list,this.offset);
    }

    /**
     * @param {object|array|number|string} item 对象
     * @param {number|string} item_sign 这个对象的唯一标识
     * @param {function} hash 返回这个item_sign的md5
     * @returns {true|any} true是插入成功 !=true是之前已经存在
     */
    insert(item,item_sign,hash_cb){
        const hash = md5(item_sign);
        typeof hash_cb === 'function' && hash_cb(hash);
        const res = this.find(hash,true);
        if(!res){
            this.set(hash,item);
            return true;
        }
        return res[1];
    }

    /**
     * @returns 返回一个数组，数组包含所有的value
     */
    clone(){
        const dist = [];
        const fillDist = (parent,dist,offset) => {
            if(offset === this.offset + 1){
                parent.forEach( e => {
                    dist.push(e[1]);
                });
            }else{
                parent.forEach( e => {
                    fillDist(e,dist,offset + 1);
                });
            }
        }
        fillDist(this.list,dist,1);
        return Utils.objDeepCopy(dist);
    }

    /**
     * @param {any} item_sign 对象唯一标识
     */
    get(item_sign){
        const hash = md5(item_sign);
        return this.find(hash);
    }

    /**
     * @param {any} item_sign 
     * @param {function} field 
     */
    change(item_sign,field){
        //考虑到存在里面的值有可能是普通变量，也可能是引用变量
        /**
         * 普通变量  value = field() //field()返回一个值，这个值为修改后的值
         * 
         * 引用变量 field(value) //调用field，并传入变量，让上层进行修改
         */

        const hash = md5(item_sign);
        this.modify(hash,field);
    }

    modify(hash,field){
        const item = this.find(hash,true);
        if(item === null)return;
        if(['string','number','boolean'].includes(typeof item[1])){
            item[1] = field(); 
        }else{
            field(item[1]);
        }
    }

    /**
     * @param {string} hash
     */
    find(hash,origin){
        return this.getByOffsetRecursion(this.list,hash,null,origin);
    }

    set(hash,value){
        this.setByOffsetRecursion(this.list,hash,value);
    }

    /**
     * 这个玩意是用来递归多维hash表用的，最多有16层递归（？
     * @param {object} parent 父级对象，此次递归中的操作都在这完成
     * @param {string} hash hash值
     * @param {number} offset 偏移值，如果没达到指定偏移量就到下一层去，到了就在本层开始找
     * @param {boolean} origin 这个表示是否获取原始数据，原始数据是一个数组，1是hash，2是value
     * @returns {null|*} 如果是null就是不存在，如果是对象就存在
     */
    getByOffsetRecursion(parent,hash,offset,origin){
        offset = offset || 1;
        if(offset === this.offset){
            const target = parent[dict[hash[offset - 1]]];
            for(let i in target){
                if(target[i][0] === hash){
                    return origin ? target[i] : target[i][1];
                }
            }
            return null;
        }else{
            return this.getByOffsetRecursion(parent[dict[hash[offset - 1]]],hash,offset + 1,origin);
        }
    }

    /**
     * 同上
     */
    setByOffsetRecursion(parent,hash,value,offset){
        offset = offset || 1;
        if(offset === this.offset){
            parent[dict[hash[offset - 1]]].push([ hash , value ]);
        }else{
            this.setByOffsetRecursion(parent[dict[hash[offset - 1]]],hash,value,offset + 1);
        }
    }

    /**
     * @param {array} array 原始值， 
     * @param {number <= 16} offset offset需要用户自己定义，因为我想了想不论怎么样都可能出现多判的情况
     */
    cover(array, offset){
        this.list = array;
        this.offset = offset;
    }

    /**
     * @returns 返回一个数组，数组内为HashList的原始值
     */
    getOriginArray(){
        return this.list.slice(0);
    }

    /**
     * @returns 返回原始数据长度
     */
    getOriginLength(){
        let len = 0;
        const self = this;
        const iter = ( parent, offset ) => {
            if(offset === self.offset){
                len += parent.length;
            }else{
                for(let i = 0; i < 16 ; i++){
                    iter(parent[i],offset + 1);
                }
            }
        }
        iter(this.list,0);
        return len;
    }

    /**
     * @param {function} condition 这是一个回调函数，它的参数将会是每一个保存的元素，参考Array.map()，请返回true或false，true表示需要删除该元素，false表示保留该元素
     */
    delete(condition){
        const iter = (parent, offset) => {
            if(offset === this.offset){
                const len = parent.length;
                for(let i = len - 1; i >= 0; i--){
                    if(condition(parent[i][1])){
                        parent.splice(i,1);
                    }
                }
            }else{
                for(let i = 0; i < 16; i++){
                    iter(parent[i], offset + 1);
                }
            }
        }
        iter(this.list, this.offset + 1);
    }
}

/**
 * 这是你从未见过的HashList类，功能齐全，操作方便，性能够顶，如果有想加的还可以随便加，如此nb的类为何不试一试呢？
 */
export default class HashList{
    /**
     * @param {number} offset 这个玩意建议填1或者2 如果数据量越大建议用更大的，比如说10^4这个级别的数据用2就行了，10^5就得3了，不建议少数据量用大了，会造成性能损耗 
     */
    constructor(offset){
        this.base = new BaseHashList(offset);
        this.current_md5 = '';
        const self = this;
        this.opter = {
            /**
             * @param {*} item 传入数据
             * @returns 插入是否成功与HashList操作对象
             */
            insert(item){
                let result = false;
                const res = self.base.find(self.current_md5);
                if(!res){
                    self.base.set(self.current_md5,item);
                    result = true;
                }else{
                    result = false;
                }
                return {
                    result : result,
                    handle : self.opter
                }
            },
            /**
             * @param {*} 相比起insert这个方法更加暴力，它不会检测当前标识是否存在，直接插入值 
             */
            set(item){
                self.base.set(self.current_md5,item);
                return {
                    result : true,
                    handle : self.opter
                }
            },
            /**
             * @returns 返回当前标识下的数据
             */
            get(){
                return{
                    result : self.base.find(self.current_md5),
                    handle : self.opter
                }
            },
            /**
             * 修改当前标识下的数据，filed为一个回调函数，如果数据类型为@param {boolean|number|string}则会赋予数据filed的返回值
             * 若数据类型为不为上述三种，则会传入当前数据，由用户修改
             * @param {function} field 
             */
            change(field){
                self.base.modify(self.current_md5,field);
                return{
                    handle : self.opter
                }
            },
            /**
             * 获取数据线性排列而成的数组
             */
            clone(){
                return{
                    result : self.base.clone(),
                    handle : self.opter
                }
            },
            /**
             * 清除所有数据
             * @returns 返回对象为result与HashList操作对象
             */
            clear(){
                self.base.clear();
                return{
                    result : true,
                    handle : self.opter
                }
            }
        }
    }

    /**
     * @param {string|number|undefined} item_sign 数据唯一标识
     * @returns 返回一个可操控HashList的对象 
     */
    operate(item_sign){
        item_sign && ( this.current_md5 = md5(item_sign));
        return this.opter;
    }

    /**
     * @param {*} array 数据原始值，原始值由HashList::getOrigin()获取
     * @param {*} offset offset需要用户自行定义
     */
    cover(array,offset){
        this.base.cover(array,offset);
    }

    /**
     * @returns 返回数据原始值
     */
    getOrigin(){
        return this.base.getOriginArray();
    }

    /**
     * @returns 返回数据原始长度
     */
    getOriginLength(){
        return this.base.getOriginLength();
    }

    /**
     * @param {function} condition 这是一个回调函数，它的参数将会是每一个保存的元素，参考Array.map()，请返回true或false，true表示需要删除该元素，false表示保留该元素
     */
    deleteByCondition(condition){
        this.base.delete(condition);
    }

    /**
     * 删除所有元素
     */
    deleteAll(){
        this.base.delete(() => true);
    }
}