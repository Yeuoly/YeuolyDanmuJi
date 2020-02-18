const state = {
    room_id : 1534600
}

const mutations = {
    setRoomID(_state,room_id){
        _state.room_id = room_id;
    }
}

const getters = {
    getRoomID(_state){
        return state.room_id;
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