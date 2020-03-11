export class IntervalTimer{
    list = [/*{
        event : '',
        cb : [],
        timer : null
    }*/]

    $off(event,cb){
        for(let i in this.list){
            if(this.list[i].event === event){
                if(!cb){
                    this.list.splice(i,1);
                }
                else{
                    for(let j in this.list[i].cb){
                        if(this.list[i].cb[j] === cb){
                            this.list[i].cb[j].splice(j,1);
                        }
                    }
                }
                return;
            }
        }
    }

    /**
     * @param {*} event 事件名 
     * @param {*} cb 结束调用
     * @param {} interval 延迟，如为初次创建事件则必填或默认为5s，单位为s
     */
    $on(event,cb,interval){
        for(let i in this.list){
            if(event === this.list[i].event){
                this.list[i].cb.push(cb);
                return this;
            }
        }
        this.list.push({
            event : event,
            cb : [cb],
            timer : null,
            interval : interval * 1000 || 5000
        });
        return this;
    }

    /**
     * @param {*} event 事件名，调用该方法时会重置计时，重新开始计算
     * @param {} interval 延迟，若为空则默认使用创建事件时的延迟
     */
    $continue(event,interval){
        for(let i in this.list){
            if(this.list[i].event === event){
                interval = interval || this.list[i].interval;
                this.list[i].timer && clearTimeout(this.list[i].timer);
                this.list[i].timer = setTimeout(() => {
                    this.list[i].cb.forEach( e => { e(); });
                },interval);
                return;
            }
        }
    }
}