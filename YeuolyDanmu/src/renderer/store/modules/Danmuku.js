import { DanmukuEventBus } from '../../events/evnetBus';
import Danmuku from '../../class/Danmuku';

const state = {
    danmus : new Danmuku()
}

const mutations = {
    addNewDanmuToDanmuku(_state,newDanmu){
        DanmukuEventBus.$emit('on-add',newDanmu);
        state.danmus.add(newDanmu);
    }
}

const actions = {
    ADD_DANMU({ commit },danmu){
        commit('addNewDanmuToDanmuku',danmu);
    }
}

export default {
    state,
    mutations,
    actions
}