<template>
  <div id="app">
  
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import DanmuLoader from 'bili-danmu-loader-yl';

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  mounted() {
    const loader = new DanmuLoader();
    loader.setRoomID(123456);
    loader.onadd = i => {
      console.log(i);
    }
    loader.startLoader( () => {
      //succeced
    } , () => {
      //failed
    })
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
