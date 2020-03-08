<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import DanmuLoader from './class/DanmuLoader';
  import { writeRecords } from './data/logs';

  export default {
    name: 'yeuoly_danmu',
    mounted() {
      const electron = require('electron');
      //防止被403，重写消息头
      const session = electron.remote.session;
      const filter = {urls: ['*://*.bilibili.com/*']};
      session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        details.requestHeaders['Origin'] = 'bilibili.com';
        details.headers['Origin'] = 'bilibili.com';
        let newVar = {requestHeaders: details.requestHeaders};
        callback(newVar);
      });
    },
    beforeDestroy() {
      writeRecords();
    },
  }
</script>

<style>
  @font-face {
        font-family: 'DanmuFont';
        src: url('./assets/SuCaiJiShiKangKangTi-2.ttf');
    }
</style>
