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
        try{
            return JSON.parse(str);
        }catch(e){
            return JSON.parse(decodeURIComponent(str));
        }
    }

    //网上抄的
    //https://blog.csdn.net/kangear/article/details/82497104
    byteToString(arr) {
        if(typeof arr === 'string') {
            return arr;
        }
        let str = '',
        _arr = arr;
        for(let i = 0; i < _arr.length; i++) {
            let one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
            if(v && one.length == 8) {
                let bytesLength = v[0].length;
                let store = _arr[i].toString(2).slice(7 - bytesLength);
                for(let st = 1; st < bytesLength; st++) {
                    store += _arr[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(_arr[i]);
            }
        }
        return str;
    }

    objDeepCopy(source) {
        const sourceCopy = source instanceof Array ? [] : {};
        for (var item in source) {
            sourceCopy[item] = typeof source[item] === 'object' ? this.objDeepCopy(source[item]) : source[item];
        }
        return sourceCopy;
    }
}

export default new Utils();