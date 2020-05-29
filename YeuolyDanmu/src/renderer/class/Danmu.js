import { User , Medal } from './User'
import { global_settings } from '../settings/global_settings';

import GiftStation from '../modules/GiftStation';

export const Danmu = (
    user_id,user_uid,user_face,message,
    medal_level,medal_nickname,medal_up,
    live_ul,live_ul_rank,
    guard_type
) => new Promise( async resolve => resolve({
    user : await User(user_id,user_uid,user_face,0,live_ul,live_ul_rank),
    medal : new Medal(medal_level,medal_nickname,medal_up,0),
    message,
    guard_type,
    type : 'normal'
}));

export const SuperChat = (
    user_id,user_uid,message,
    medal_level,medal_nickname,medal_up,
    live_ul,
    price,start_time,end_time,
    background_color,background_color_bottom,price_color,background_image,
    face,
) => new Promise( async resolve => resolve({
    price,start_time,end_time,background_color,background_color_bottom,price_color,background_image,
    user : await User(user_id,user_uid,face,0,live_ul,'none'),
    medal : new Medal(medal_level,medal_nickname,medal_up,0),
    message,
    type : 'super_chat',
}));

export const Guard = (
    user_id,user_uid,price,type
) => new Promise( async resolve => {
    const info = GiftStation.getGuardInfo(type);
    resolve({
        user : await User(user_id,user_uid,null,0,0,'none'),
        guard_type : type,
        price,
        name : info['name'],
        img : info['img']
    });
});

export const Gift = (
    user_id,user_uid,face,
    gift_id,gift_name,gift_price,gift_num,
    is_super
) => new Promise( async resolve => resolve({
    user : await User(user_id,user_uid,face,0,0,0),
    gift_id,gift_name,gift_price,gift_num,is_super,
    message : `${global_settings['display_module']['gift_greet']}${gift_num}个${gift_name}`,
    gift_image : GiftStation.getGiftImage(gift_id),
    initMessage(){ `${global_settings['display_module']['gift_greet']}${this.gift_num}个${this.gift_name}`; },
    type : 'gift'
}));