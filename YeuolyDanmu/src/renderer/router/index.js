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
        },{
          name : 'color-settings',
          path : '/index/color-settings',
          component: require('@/views/ColorSettings.vue').default,
          meta : {
            title : '选择弹幕颜色'
          }
        },{
          name : 'advance-settings',
          path : '/index/advance-settings',
          component: require('@/views/AdvanceSettings.vue').default,
          meta : {
            title : '高级设置，请根据教程更改，部分设置重启生效'
          }
        },{
          name : 'records-gift-window',
          path : '/index/records-gift-window',
          component: () => import('@/views/RecordsDisplayWindow.vue'),
          meta : {
            title : '礼物记录',
            type : 'gift'
          }
        },{
          name : 'records-sc-window',
          path : '/index/records-sc-window',
          component: () => import('@/views/RecordsDisplayWindow.vue'),
          meta : {
            title : 'SC记录',
            type : 'sc'
          }
        },{
          name : 'records-guard-window',
          path : '/index/records-guard-window',
          component: () => import('@/views/GuardDisplayWindow.vue'),
          meta : {
            title : '舰长记录',
          }
        },{
          name : 'statistic',
          path : '/index/statistic',
          component: () => import('@/views/Statistic.vue'),
          meta : {
            title : '统计数据'
          }
        },{
          name : 'dd-rank',
          path : '/index/dd-rank',
          component: () => import('@/views/DDRank.vue'),
          meta : {
            title : '统计排名'
          }
        },{
          name : 'plugins-list',
          path : '/index/plugins-list',
          component: () => import('@/views/PluginsList.vue'),
          meta : {
            title : '插件列表'
          }
        },{
          name : 'qiafan',
          path : '/index/qiafan',
          component: () => import('@/views/QiaFan.vue'),
          meta : {
            title : '恰饭'
          }
        },{
          name : 'feedback',
          path : '/index/feedback',
          component: () => import('@/views/Feedback.vue'),
          meta : {
            title : '反馈'
          }
        },{
          name : 'ys-login',
          path : '/index/ys-login',
          component: () => import('@/views/YSLoginPage.vue'),
          meta : {
            title : '登录YS账号'
          }
        }
      ]
    },
    {
      path : '/danmu',
      name : 'danmu',
      component: () => import('@/views/DanmuDialog.vue')
    },
    {
      path: '*',
      redirect: '/index/log'
    }
  ]
})
