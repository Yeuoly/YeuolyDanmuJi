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
          name : 'log',
          path : '/index/log',
          component: require('@/components/items/Logger.vue').default,
          meta : {
            title : '日志'
          }
        },
        {
          name : 'task',
          path : '/index/task',
          component: require('@/views/Task.vue').default,
          meta : {
            title : '任务'
          }
        },
        {
          name : 'room-settings',
          path : '/index/room-settings',
          component: require('@/views/RoomSettings.vue').default,
          meta : {
            title : '房间设置'
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
