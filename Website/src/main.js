import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  routes : [
    // {
    //   name : 'index',
    //   path : '/',
    //   component : () => import('./views/Index.vue')
    // },
    {
      name : 'history',
      path : '/history',
      component : () => import('./views/History.vue')
    },
    {
      path : '*',
      redirect : '/history'
    }
  ]
});

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
