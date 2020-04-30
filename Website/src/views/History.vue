<template>
    <VContainer>
        <VCard>
            <VCardText>
                这里的版本都是稳定版本，一些测试版本我都删掉了，如果需要的话可以去github里面找分支，虽然估计也没人感兴趣。目前只提供了Windows 64位的下载，32位的以后再考虑，主要是现在直播的电脑基本没谁用32位了吧，如果Mac之类的有需要的话可以自行打包，需要的人还蛮多的话我再试一下打包（我没得Mac）
            </VCardText>
        </VCard>
        <VTimeline dense clipped>
            <VTimelineItem v-for="(i, key) in list" :key="key" fill-dot small left class="white-text mb-12">
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
export default {
    data() {
        return {
            history : [{
                version : 'v1.0.1',
                date : '2020/3/2',
                git_code : '20cce9ab25b3a3af2b801a6ce77dfc224ca1a941',
                downloads : {
                    windows : {
                        x64 : 'http://downloads.srmxy.cn/packed-YeuolyDanmu-1.0.1.rar',
                        x86 : ''  
                    },
                },
                introduction : 'YeuolyDanmu第一个稳定版本发布'
            },{
                version : 'v1.0.2',
                date : '2020/3/13',
                git_code : 'e08edc0e529e6b132017f33d89d28872d0b7c3a9',
                downloads : {
                    windows : {
                        x64 : 'http://downloads.srmxy.cn/packed-YeuolyDanmu-1.0.2.rar',
                        x86 : ''
                    },
                },
                introduction : '添加记录和统计模块，可惜没届到（哭辽'
            },{
                version : 'v1.0.3',
                date : '2020/3/17',
                git_code : '538dd8e63e5e4cb9a3644db44e91b44223700fad',
                downloads : {
                    windows : {
                        x64 : 'http://downloads.srmxy.cn/packed-YeuolyDanmu-1.0.3.rar',
                        x86 : ''
                    },
                },
                introduction : '添加排名、反馈、恰饭、舰长记录，优化任务界面'
            },{
                version : 'v1.0.4',
                date : '2020/3/27',
                git_code : '118f33019d1b1adf5f880d17582303eebb301302',
                downloads : {
                    windows : {
                        x64 : 'http://downloads.srmxy.cn/packed-YeuolyDanmu-1.0.3.rar',
                        x86 : ''
                    },
                },
                introduction : '添加插件模块'
            },{
                version : 'v1.0.4.01',
                date : '2020/3/28',
                git_code : '6f7b6b225a940cd7bc7d3b12fd17d6fa22043160',
                downloads : {
                    windows : {
                        x64 : '',
                        x86 : ''
                    },
                },
                introduction : '大改UI，添加账户，终于有logo了'
            },{
                version : 'v1.0.4.02',
                date : '2020/4/7',
                git_code : 'f9d0d0fe27186090a293336f422221adda5a2585',
                downloads : {
                    windows : {
                        x64 : 'http://downloads.srmxy.cn/YeuolyDanmu-1.0.4.02.rar',
                        x86 : ''
                    },
                },
                introduction : '移除恰饭，添加缓存模块'
            },{
                version : 'v1.0.5',
                date : '2020/4/18',
                git_code : '13f2f7ead680e9c39515a01db3575dbe7f8999fe',
                downloads : {
                    windows : {
                         x64 : 'http://downloads.srmxy.cn/YeuolyDanmu-1.0.5.rar',
                        x86 : ''
                    },
                },
                introduction : '更改缓存模块，添加头像刷新、读弹幕'
            }]
        }
    },
    computed: {
        list(){
            return JSON.parse(JSON.stringify(this.history)).reverse();
        }
    },
    methods: {
        downloads(src){
            window.open(src);
        },
        github(code){
            window.open('https://github.com/Yeuoly/YeuolyDanmuJi/tree/' + code);
        }
    },
}
</script>