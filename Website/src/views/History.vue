<template>
    <VContainer>
        <VCard>
            <VCardText>
                这里的版本都是稳定版本，一些测试版本我都删掉了，如果需要的话可以去github里面找分支，虽然估计也没人感兴趣。目前只提供了Windows 64位的下载，32位的以后再考虑，主要是现在直播的电脑基本没谁用32位了吧，如果Mac之类的有需要的话可以自行打包，需要的人还蛮多的话我再试一下打包（我没得Mac）
            </VCardText>
        </VCard>
        <VTimeline dense clipped>
            <VTimelineItem v-for="(i, key) in history" :key="key" fill-dot small left class="white-text mb-12">
                <VCard class="elevation-2">
                    <VCardTitle class="py-0">
                        {{ i.version }} - {{ key === 0 ? '最新版本' : '稳定版本' }}
                    </VCardTitle>
                    <VCardText>
                        {{i.date}}
                    </VCardText>
                    <VCardText class="py-0">
                        <VBtn small text color="primary" v-if="i.downloads.windows.x64" @click="downloads(i.downloads.windows.x64)">win x64下载</VBtn>
                        <VBtn small text color="primary" v-if="i.downloads.windows.x86" @click="downloads(i.downloads.windows.x86)">win x86下载</VBtn>
                        <VBtn small text color="primary" @click="github(i.git_code)">查看分支：{{i.git_code.substr(0,6)}}</VBtn>
                    </VCardText>
                    <VCardText>
                        {{ i.introduction }}
                    </VCardText>
                </VCard>
            </VTimelineItem>
        </VTimeline>
    </VContainer>
</template>

<script>
import axios from 'axios';
import { stringify } from 'querystring';

export default {
    data() {
        return {history : []};
    },
    methods: {
        downloads(src){
            window.open(src);
        },
        github(code){
            window.open('https://github.com/Yeuoly/YeuolyDanmuJi/tree/' + code);
        }
    },
    async mounted(){
        const { data } = await axios.post('http://version.srmxy.cn/index/version/lst',stringify({sign:27}));
        const versions = data['data']['data'];
        versions.forEach(e => {
            const p = JSON.parse(e['introduction']);
            this.history.push({
                git_code : e['gitcode'],
                version : e['version'],
                date : p['date'],
                downloads : p['downloads'],
                introduction : p['introduction']
            });
        });
    }
}
</script>