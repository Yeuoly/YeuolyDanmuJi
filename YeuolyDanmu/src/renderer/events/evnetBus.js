import Vue from 'vue'
export const OrdinaryEventBus = new Vue();
export const InfoEventBus = new Vue();
export const DanmuGroupEventBus = new Vue();

// 测试证明我写的这个憨批玩意不行，还是用Vue的好了，有空去看一下Vue的源码
// export const DanmuGroupEventBus = {
//     $emit(event, ...args){
//         if(this.cb_list[event]){
//             this.cb_list[event].forEach( e => {
//                 e(...args);
//             });
//         }
//     },
//     $on(event, cb){
//         this.addCallBack(event,cb);
//     },
//     $off(event, cb){
//         this.removeCallBack(event,cb);
//     },
//     createEvent(event){
//         this.cb_list[event] = [];
//     },
//     removeEvent(event){
//         for(let i in this.cb_list){
//             if(i === event){
//                 this.cb_list.splice(i,1);
//                 return;
//             }
//         }
//     },
//     addCallBack(event, cb){
//         if(this.cb_list[event]){
//             this.cb_list[event].push(cb);
//         }else{
//             this.createEvent(event);
//             this.cb_list[event].push(cb);
//         }
//     },
//     removeCallBack(event, cb){
//         for(let i in this.cb_list){
//             if(i === event){
//                 for(let j in this.cb_list[i]){
//                     if(this.cb_list[i][j] === cb){
//                         this.cb_list[i].splice(j,1);
//                     }
//                 }
//             }
//         }
//     },
//     cb_list : {}
// }