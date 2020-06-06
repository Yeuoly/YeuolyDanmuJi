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

    fillDefaultOptions(src, dist){
        for(let i in dist){
            const type = typeof src[i];
            if(['array','object'].includes(type)){
                this.fillDefaultOptions(src[i], dist[i]);
            }else{
                src[i] = src[i] || dist[i];
            }
        }
    }

    dom = {
        getElementPosition(dom){
            return {
                x : dom.offsetLeft,
                y : dom.offsetTop
            }
        },
        getEventPosition(ev){
            return {
                x : ev.clientX,
                y : ev.clientY
            }
        },
        getEventRelativePosition(ev){
            return {
                x : ev.offsetX,
                y : ev.offsetY
            }
        },
        getElementSize(dom){
            return {
                width : dom.offsetWidth,
                height : dom.offsetHeight
            }
        }
    }
}

export default new Utils();