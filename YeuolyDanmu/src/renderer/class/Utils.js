//工具人
class Utils{
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
}

export default new Utils();