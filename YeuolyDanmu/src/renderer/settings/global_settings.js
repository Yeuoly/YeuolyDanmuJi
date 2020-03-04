import Store from 'electron-store';
const store = new Store();
let global_settings = store.get('global_settings',{
    log_module : {
        log_path : 'C:\\Users\\Public\\YeuolyDanmu\\',
        gift_path : 'C:\\Users\\Public\\YeuolyDanmu\\',
        sc_path : 'C:\\Users\\Public\\YeuolyDanmu\\'
    },
    loading_moudle : {
        auto_filt_low_gift : true,
        direct_trans_gift_min_line : 9800,
        danmu_temp_max_count : 50,
        speed_list_info : [
            { SPEED : 8 , INTERVAL : 2000 , RPICE_MIN : 10000 , LATIAO_MIN : 100 },
            { SPEED : 5 , INTERVAL : 1000 , PRICE_MIN : 5000 , LATIAO_MIN : 50 },
            { SPEED : 2 , INTERVAL : 500 , PRICE_MIN : 1000 , LATIAO_MIN : 5 },
            { SPEED : 0 , INTERVAL : 200 , PRICE_MIN : 100 , LATIAO_MIN : 1 }
        ],
        auto_filt_danmu : true,
        host_server_index : 0
    },
    display_module : {
        auto_fold_repeat_danmu : true,
        super_staying_time_each : 10
    }
});

const refreshSettings = () => {
    global_settings = store.get('global_settings');
}

const setSettings = () => {
    store.set('global_settings',global_settings);
}

export { global_settings , refreshSettings , setSettings };