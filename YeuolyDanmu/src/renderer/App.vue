<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import DanmuLoader from './class/DanmuLoader';

  export default {
    name: 'yeuoly_danmu',
    methods: {
      
    },
    mounted() {
      const DanmuGetter = new DanmuLoader(1534600);
      DanmuGetter.startLoader();
    }
  }
</script>

<style>
  /* CSS */
</style>
