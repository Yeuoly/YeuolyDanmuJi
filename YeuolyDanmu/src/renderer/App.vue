<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import DanmuLoader from './class/DanmuLoader';
  import { writeRecords } from './data/records_ipc';

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
  @font-face {
    font-family: 'SourceCodePro';
    src: url('./assets/SourceCodePro-Black.ttf');
  }
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    ::-webkit-scrollbar
    {
        width: 8px;
        height: 8px;
        /* background-color: rgb(240,240,240); */
    }
 
    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track
    {
        /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);*/
        /*border-radius: 10px;*/
        /* background-color: rgb(30,30,30); */
    }
 
    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb
    {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(193,193,193);
        background-color: rgb(193,193,193);
    }
</style>
