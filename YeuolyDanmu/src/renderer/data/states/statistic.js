import Utils from '../../class/Utils';

export default {
    total_price : 0,
    au_price : 0,
    ag_price : 0,
    danmu_count : 0,
    interactional_dd_count : 0,
    paied_dd_count : 0,
    total_sc_price : 0,
    total_guard_price : 0,
    total_guard_count : 0,
    danmu_speeds : {  
        value : [ 0 ],
        date : [ Utils.formatDate(new Date(),'hh:mm:ss') ]
    },
    //这个是为后续统计做的，但考虑到现在的CPU已经挺蛋疼了，就暂时不做了
    gift_classfiy_count : []
}