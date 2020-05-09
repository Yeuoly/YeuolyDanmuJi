import Vue from 'vue'
import Router from 'vue-router'
import { OrdinaryEventBus } from '../events/evnetBus';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/Index.vue'),
      meta : {
        title : '默认目录'
      },
      children : [
        {
          name : 'log',
          path : '/index/log',
          component: () => import('@/components/items/Logger.vue'),
          meta : {
            title : '日志'
          }
        },
        {
          name : 'task',
          path : '/index/task',
          component: () => import('@/views/Task.vue'),
          meta : {
            title : '任务'
          }
        },
        {
          name : 'room-settings',
          path : '/index/room-settings',
          component: () => import('@/views/RoomSettings.vue'),
          meta : {
            title : '房间设置'
          }
        },{
          name : 'color-settings',
          path : '/index/color-settings',
          component: () => import('@/views/ColorSettings.vue'),
          meta : {
            title : '选择弹幕颜色'
          }
        },{
          name : 'advance-settings',
          path : '/index/advance-settings',
          component: () => import('@/views/AdvanceSettings.vue'),
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
        },{
          name : 'cache-manager',
          path : '/index/cache-manager',
          component: () => import('@/views/CacheManager.vue'),
          meta : {
            title : '缓存管理'
          }
        },{
          name : 'records-reader',
          path : '/index/records-reader',
          component: () => import('@/views/RecordsReader.vue'),
          meta : {
            title : '历史'
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
});

router.afterEach((to, from) => {
  OrdinaryEventBus.$emit(`router-to-${to.name}`);
  OrdinaryEventBus.$emit(`router-lv-${from.name}`);
});

export default router;