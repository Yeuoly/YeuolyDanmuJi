import Vue from 'vue';
import Vuetify , {
    VApp,
    VContainer,
    VCard,
    VCardText,
    VCardTitle,
    VBtn,
    VSlideYTransition,
    VTimelineItem,
    VTimeline
} from 'vuetify/lib';

import { Ripple } from 'vuetify/lib/directives';

Vue.use(Vuetify,{
    components : {
        VApp,
        VContainer,
        VCard,
        VCardText,
        VCardTitle,
        VBtn,
        VSlideYTransition,
        VTimelineItem,
        VTimeline
    },
    directives : {
        Ripple
    }
});

export default new Vuetify();
