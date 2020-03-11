import { global_settings } from './global_settings';

export default {
    getEach(){
        return global_settings['display_module']['super_staying_time_each'];
    },
    list : [
    //    >     <=    times
        [ 0   , 9.9 , 1 ],
        [ 9.9 , 30  , 2 ],
        [ 30  , 50  , 3 ],
        [ 50  , 100 , 5 ],
        [ 100 , 300 , 10 ],
        [ 300 , 500 , 20 ],
        [ 500 , 1000, 50 ],
        [ 1000, 2000, 80 ]
    ],
    getTimes(price){
        for(let i in this.list){
            if(price > this.list[i][1]){
                continue;
            }else{
                return this.list[i][2];
            }
        }
    }
}