//初始化设置
const Store = require('electron-store');
const store = new Store();
const settings = store.get('settings') || { room_id : 1534600 };

const state = {
    room_id : settings['room_id']
}

const mutations = {
    setRoomID(_state,room_id){
        _state.room_id = room_id;
        store.set('settings.room_id',room_id);
    }
}

const getters = {
    getRoomID(_state){
        return _state.room_id;
    }
}

const actions = {
    SET_ROOM_ID({ commit },room_id){
        commit('setRoomID',room_id);
    }
}

export default{
    state,
    getters,
    mutations,
    actions
}