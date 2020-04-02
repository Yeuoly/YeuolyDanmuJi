import HashList from '../../class/HashList';

export default {
    daily_log_records : [{
        class_name : 'grey',
        log : '[LogConsole]:日志模块已启动',
        type : 'info',
        line_id : 0
    },{
        class_name : 'grey',
        log : '[Greet]大佬好，我是这个弹幕姬的作者Yeuoly，这个破弹幕姬基于Electron+Vue+ElementUI开发，' +
            '希望您能用着舒服。如果大佬们想参加发开的话我留个链接放这里orz https://github.com/Yeuoly/YeuolyDanmuJI',
        type : 'info',
        line_id : 1
    },{
        class_name : 'grey',
        log : '[Contact]顺便再放一个联系方式：QQ2035914926',
        type : 'info',
        line_id : 2
    }],
    daily_gift_records : [],
    daily_sc_records : [],
    daily_danmu_records : [],
    daily_guard_records : [],
    //好了，开始处理hash，参加互动的dd数量级应该是10^3-10^4，用两层表够了，打钱的dd应该在10^2左右，一层表就行了
    interactional_dd_hash : new HashList(2),
    paied_dd_hash : new HashList(1),
}