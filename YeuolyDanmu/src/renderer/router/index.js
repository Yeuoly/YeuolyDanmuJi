import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/views/Index.vue').default,
      meta : {
        title : '默认目录'
      },
      children : [
        {
          name : 'logo',
          path : '/index/logo',
          component: require('@/components/items/Logger.vue').default,
          meta : {
            title : '日志'
          }
        }
      ]
    },
    {
      path: '*',
      redirect: '/index/log'
    }
  ]
})
