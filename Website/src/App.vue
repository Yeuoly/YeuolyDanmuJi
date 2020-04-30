<template>
    <VApp>
        <LayoutHeader />
        <div style="margin-top: 40px">
            <VSlideYTransition mode="out-in">
                <router-view></router-view>
            </VSlideYTransition>
        </div>
    </VApp>
</template>

<script>
import LayoutHeader from './components/LayoutHeader';

export default {
    name : 'App',
    components : { LayoutHeader }
}
</script>