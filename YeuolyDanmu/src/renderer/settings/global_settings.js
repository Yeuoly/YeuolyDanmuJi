import Store from 'electron-store';
const store = new Store();

//初始值
const initial_value = {
    log_module : {
        log_path : 'C:\\Users\\Public\\YeuolyDanmu\\',
        gift_path : 'C:\\Users\\Public\\YeuolyDanmu\\',
        sc_path : 'C:\\Users\\Public\\YeuolyDanmu\\'
    },
    loading_module : {
        auto_filt_low_gift : true,
        direct_trans_gift_min_line : 9800,
        gift_buffer_times : 3000,
        ordinary_max_price : 10000,
        danmu_temp_max_count : 50,
        speed_list_info : [
            { SPEED : 8 , INTERVAL : 2000 , PRICE_MIN : 10000 , LATIAO_MIN : 100 , NAME_CN : '极快' },
            { SPEED : 5 , INTERVAL : 1000 , PRICE_MIN : 5000 , LATIAO_MIN : 50 , NAME_CN : '快' },
            { SPEED : 2 , INTERVAL : 500 , PRICE_MIN : 1000 , LATIAO_MIN : 5 , NAME_CN : '一般' },
            { SPEED : 0 , INTERVAL : 200 , PRICE_MIN : 100 , LATIAO_MIN : 1 , NAME_CN : '慢' }
        ],
        auto_filt_super_gift_danmu : true,
        host_server_index : 0
    },
    display_module : {
        auto_fold_repeat_danmu : true,
        super_staying_time_each : 10,
        gift_greet : '赠送了',
    }
}

let global_settings = store.get('global_settings', initial_value);

const refreshSettings = () => {
    global_settings = store.get('global_settings');
}

const setSettings = () => {
    store.delete('global_settings');
    store.set('global_settings',global_settings);
}

const initSettings = () => {
    store.delete('global_settings');
    store.set('global_settings',initial_value);
    refreshSettings();
}

export { global_settings , refreshSettings , setSettings , initSettings };