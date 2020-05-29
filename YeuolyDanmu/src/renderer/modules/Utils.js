//工具人
class Utils{
    formatDate(date,fmt){
        var o = { 
            "M+" : date.getMonth()+1,                 //月份 
            "d+" : date.getDate(),                    //日 
            "h+" : date.getHours(),                   //小时 
            "m+" : date.getMinutes(),                 //分 
            "s+" : date.getSeconds(),                 //秒 
            "q+" : Math.floor((date.getMonth()+3)/3), //季度 
            "S"  : date.getMilliseconds()             //毫秒 
        }; 
        if(/(y+)/.test(fmt)) {
                fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
        }
         for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                 fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
             }
         }
        return fmt; 
    }

    varToPointer(fn){
        const p = function(){};
        p.toString = function(){
            return fn();
        }
        return p;
    }

    mergeArrayBuffer(ab1, ab2) {
        var u81 = new Uint8Array(ab1),
        u82 = new Uint8Array(ab2),
        res = new Uint8Array(ab1.byteLength + ab2.byteLength);
        res.set(u81, 0);
        res.set(u82, ab1.byteLength);
        return res.buffer;
    }

    transFormatFromBufferToJson(msg){
        const ary = new Uint8Array(msg);
        const str = this.byteToString(ary);
        return JSON.parse(str);
    }

    //网上抄的
    //https://blog.csdn.net/kangear/article/details/82497104
    byteToString(array) {
        const bytes = array.slice(0)
        const filterArray = [
            [0x7f],
            [0x1f, 0x3f],
            [0x0f, 0x3f, 0x3f],
            [0x07, 0x3f, 0x3f, 0x3f]
        ]
        let j
        let str = ''
        for (let i = 0; i < bytes.length; i = i + j) {
            const item = bytes[i]
            let number = ''
            if (item >= 240) {
                j = 4
            } else if (item >= 224) {
                j = 3
            } else if (item >= 192) {
                j = 2
            } else if (item < 128) {
                j = 1
            }
            const filter = filterArray[j - 1]
            for (let k = 0; k < j; k++) {
            let r = (bytes[i + k] & filter[k]).toString(2)
            const l = r.length
            if (l > 6) {
                number = r
                break
            }
            for (let n = 0; n < 6 - l; n++) {
                r = '0' + r
            }
                number = number + r
            }
            str = str + String.fromCharCode(parseInt(number, 2))
        }
        console.log(array);
        console.log(str);
        return str
    }

    objDeepCopy(source) {
        const sourceCopy = source instanceof Array ? [] : {};
        for (var item in source) {
            sourceCopy[item] = typeof source[item] === 'object' ? this.objDeepCopy(source[item]) : source[item];
        }
        return sourceCopy;
    }

    getVisualMemorySize(B){
        let l = ['B','KB','MB','GB','TB','PB'];
        for(let i = 0; i < 6; i++){
            if(B < Math.pow(1024, i + 1)){
                return ( B / Math.pow(1024, i)).toFixed(3) + l[i];
            }
        }
    }

    /**
     * @param {object} src 
     * @param {object} dist 
     * 检测更新设置的key有没有更新
     * src为源数据
     * dist为标准key
     */
    updateOptions(src, dist){
        for(let i in dist){
            const type = typeof src[i];
            if(['array','object'].includes(type)){
                this.updateOptions(src[i], dist[i]);
            }else if(['number','string','symbol','boolean'].includes(type)){
                
            }else if(type === 'undefined'){
                src[i] = dist[i];
            }
        }
    }
}

export default new Utils();