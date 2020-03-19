<template>
  <div class="qiafan">
      <h2 style="text-align: center;color: grey;">救救孩子叭，孩子要恰不起饭了</h2>
      <img class="qiafan-img" v-for="i in qiafan" :key="i" :src="i">
  </div>
</template>

<script>

const qiafan = {
    wechat : require('../assets/qiafan_wechat.png'),
    afadian : require('../assets/qiafan_aifadian.png'),
    alipay : require('../assets/qiafan_alipay.png'),
}

export default {
    name : 'QiaFan',
    data : () => ({
        qiafan : qiafan
    })
}
</script>

<style>
    .qiafan-img{
        width: 33.33333%;
    }


</style>