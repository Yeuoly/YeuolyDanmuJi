import Vue from 'vue'
import axios from 'axios'

//初始化设置
import './style/danmu.css';
import './style/index.css';

//自定义弹幕需要用到这个指令集，现在没必要加载进来
//import './directive/index';

axios.defaults.withCredentials = true;

import App from './App'
import router from './router'

//安装颜色选择器
import vcolorpicker from 'vcolorpicker';
Vue.use(vcolorpicker);

import VueCookie from 'vue-cookie';
Vue.use(VueCookie);

//多窗口初始化
import Win from 'electron-vue-windows';
Win.init(router,{
  freeWindowNum: 2,
  port : 9080
});
Vue.prototype.$Win = Win;

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')