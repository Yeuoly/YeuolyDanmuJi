import { DanmukuEventBus } from '../../events/evnetBus';
import Danmuku from '../../class/Danmuku';

const state = {
    danmus : new Danmuku()
}

const mutations = {
    addNewDanmusToDanmuku(_state,newDanmus){
        DanmukuEventBus.$emit('on-add-group',newDanmus);
        state.danmus.addGroup(newDanmus);
    }
}

const actions = {
    ADD_DANMUS({ commit },danmus){
        commit('addNewDanmusToDanmuku',danmus);
    }
}

export default {
    state,
    mutations,
    actions
}