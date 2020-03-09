<template>
    <div class="statistic">
        <p class="statistic-info">一共有多少弹幕？：{{statistic.danmu_count}}</p>
        <p class="statistic-info">互动了的DD有多少？：{{statistic.interactional_dd_count}}</p>
        <p class="statistic-info">打钱了的DD有多少？：{{statistic.paied_dd_count}}</p>
        <p class="statistic-info">一共打了多少瓜子？：{{statistic.total_price}}</p>
        <p class="statistic-info">一共打了多少金瓜子？：{{statistic.au_price}}</p>
        <p class="statistic-info">一共打了多少银瓜子？：{{statistic.ag_price}}</p>
        <p class="statistic-info">一共打了多少SC？：{{statistic.total_sc_price}}</p>
    </div>
</template>

<script>
import { getStatisticPointer } from '../data/logs';

export default {
    data : () => ({
        statistic : getStatisticPointer()
    })
}
</script>

<style>
.statistic{

}
.statistic-info{

}
</style>