import { DanmukuEventBus } from '../../events/evnetBus';
import Danmuku from '../../class/Danmu';

const state = {
    danmus : new Danmuku()
}

const mutations = {
    addNewDanmuToDanmuku(state,newDanmus){
        DanmukuEventBus.$emit('refreshDanmuku',newDanmus);
        state.danmus.addGroup(newDanmus);
    }
}

export default {
    state,
    mutations
}