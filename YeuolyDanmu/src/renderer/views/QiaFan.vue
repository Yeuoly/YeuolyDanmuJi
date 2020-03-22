<template>
  <div class="qiafan">
      <h2 style="text-align: center;color: grey;">救救孩子叭，孩子要恰不起饭了</h2>
      <img id="waifu" :src="qiafan['waifu']" class="qiafan-img">
      <img id="wechat" :src="qiafan['wechat']" class="qiafan-img">
      <img id="alipay" :src="qiafan['alipay']" class="qiafan-img">
  </div>
</template>

<script>

const qiafan = {
    wechat : require('../assets/qiafan_wechat.png'),
    waifu : require('../assets/mywife.jpeg'),
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
        width: 18%;
    }

    #waifu{
        width: 40%;
        position: absolute;
        top: 70px;
        left: 240px;
    }

    #wechat{
        position: absolute;
        top: 330px;
    }

    #alipay{
        position: absolute;
        right: 0;
        top: 330px;
    }

</style>