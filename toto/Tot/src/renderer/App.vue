<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import DanmuLoader from './class/DanmuLoader';

  export default {
    name: 'tot',
    mounted() {
      const test = new DanmuLoader();
      test.setOnDanmu( danmu => {

      });
      test.setRoomID(1440094);
      test.startLoader();
    },
  }
</script>

<style>
  /* CSS */
</style>
