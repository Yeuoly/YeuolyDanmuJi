(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["chunk-2d2259e5"], {
    e4bb: function(o, n, t) {
        "use strict";
        t.r(n);
        var d = function() {
            var o = this
              , n = o.$createElement
              , t = o._self._c || n;
            return t("VContainer", [t("VCard", [t("VCardText", [o._v(" 这里的版本都是稳定版本，一些测试版本我都删掉了，如果需要的话可以去github里面找分支，虽然估计也没人感兴趣。目前只提供了Windows 64位的下载，32位的以后再考虑，主要是现在直播的电脑基本没谁用32位了吧，如果Mac之类的有需要的话可以自行打包，需要的人还蛮多的话我再试一下打包（我没得Mac） ")])], 1), t("VTimeline", {
                attrs: {
                    dense: "",
                    clipped: ""
                }
            }, o._l(o.list, (function(n, d) {
                return t("VTimelineItem", {
                    key: d,
                    staticClass: "white-text mb-12",
                    attrs: {
                        "fill-dot": "",
                        small: "",
                        left: ""
                    }
                }, [t("VCard", {
                    staticClass: "elevation-2"
                }, [t("VCardTitle", {
                    staticClass: "py-0"
                }, [o._v(" " + o._s(n.version) + " - " + o._s(0 === d ? "最新版本" : "稳定版本") + " ")]), t("VCardText", [o._v(" " + o._s(n.date) + " ")]), t("VCardText", {
                    staticClass: "py-0"
                }, [n.downloads.windows.x64 ? t("VBtn", {
                    attrs: {
                        small: "",
                        text: "",
                        color: "primary"
                    },
                    on: {
                        click: function(t) {
                            return o.downloads(n.downloads.windows.x64)
                        }
                    }
                }, [o._v("win x64下载")]) : o._e(), n.downloads.windows.x86 ? t("VBtn", {
                    attrs: {
                        small: "",
                        text: "",
                        color: "primary"
                    },
                    on: {
                        click: function(t) {
                            return o.downloads(n.downloads.windows.x86)
                        }
                    }
                }, [o._v("win x86下载")]) : o._e(), t("VBtn", {
                    attrs: {
                        small: "",
                        text: "",
                        color: "primary"
                    },
                    on: {
                        click: function(t) {
                            return o.github(n.git_code)
                        }
                    }
                }, [o._v("查看分支：" + o._s(n.git_code.substr(0, 6)))])], 1), t("VCardText", [o._v(" " + o._s(n.introduction) + " ")])], 1)], 1)
            }
            )), 1)], 1)
        }
          , e = []
          , a = {
            data: function() {
                return {
                    history: [{
                        version: "v1.0.1",
                        date: "2020/3/2",
                        git_code: "20cce9ab25b3a3af2b801a6ce77dfc224ca1a941",
                        downloads: {
                            windows: {
                                x64: "http://downloads.srmxy.cn/packed-YeuolyDanmu-1.0.1.rar",
                                x86: ""
                            }
                        },
                        introduction: "YeuolyDanmu第一个稳定版本发布"
                    }, {
                        version: "v1.0.2",
                        date: "2020/3/13",
                        git_code: "e08edc0e529e6b132017f33d89d28872d0b7c3a9",
                        downloads: {
                            windows: {
                                x64: "http://downloads.srmxy.cn/packed-YeuolyDanmu-1.0.2.rar",
                                x86: ""
                            }
                        },
                        introduction: "添加记录和统计模块，可惜没届到（哭辽"
                    }, {
                        version: "v1.0.3",
                        date: "2020/3/17",
                        git_code: "538dd8e63e5e4cb9a3644db44e91b44223700fad",
                        downloads: {
                            windows: {
                                x64: "http://downloads.srmxy.cn/packed-YeuolyDanmu-1.0.3.rar",
                                x86: ""
                            }
                        },
                        introduction: "添加排名、反馈、恰饭、舰长记录，优化任务界面"
                    }, {
                        version: "v1.0.4",
                        date: "2020/3/27",
                        git_code: "118f33019d1b1adf5f880d17582303eebb301302",
                        downloads: {
                            windows: {
                                x64: "http://downloads.srmxy.cn/packed-YeuolyDanmu-1.0.3.rar",
                                x86: ""
                            }
                        },
                        introduction: "添加插件模块"
                    }, {
                        version: "v1.0.4.01",
                        date: "2020/3/28",
                        git_code: "6f7b6b225a940cd7bc7d3b12fd17d6fa22043160",
                        downloads: {
                            windows: {
                                x64: "",
                                x86: ""
                            }
                        },
                        introduction: "大改UI，添加账户，终于有logo了"
                    }, {
                        version: "v1.0.4.02",
                        date: "2020/4/7",
                        git_code: "f9d0d0fe27186090a293336f422221adda5a2585",
                        downloads: {
                            windows: {
                                x64: "http://downloads.srmxy.cn/YeuolyDanmu-1.0.4.02.rar",
                                x86: ""
                            }
                        },
                        introduction: "移除恰饭，添加缓存模块"
                    }, {
                        version: "v1.0.5",
                        date: "2020/4/18",
                        git_code: "13f2f7ead680e9c39515a01db3575dbe7f8999fe",
                        downloads: {
                            windows: {
                                x64: "http://downloads.srmxy.cn/YeuolyDanmu-1.0.5.rar",
                                x86: ""
                            }
                        },
                        introduction: "更改缓存模块，添加头像刷新、读弹幕"
                    }, {
                        version: 'v1.0.6',
                        date: '2020/5/30',
                        git_code: 'fca69552ef2ce6535578caf72777ba425ec095ce',
                        downloads: {
                            windows: {
                                x64: 'http://downloads.srmxy.cn/YeuolyDanmu-1.0.6.rar',
                                x86: ''
                            },
                        },
                        introduction: '更换通讯方式，修复无法加载弹幕，更改人气统计算法，优化代码结构'
                    }, {
                        version: 'v1.0.6.1',
                        date: '2020/6/21',
                        git_code: 'f0022745824fa7995bba58dd0e8895f50c9a0bd9',
                        downloads: {
                            windows: {
                                x64: 'http://downloads.srmxy.cn/YeuolyDanmu-1.0.6.1.rar',
                                x86: ''
                            },
                        },
                        introduction: '因为不可抗力把通讯换回了ipc，修复部分电脑上窗口拖动和computed无法返回函数的bug'
                    }]
                }
            },
            computed: {
                list: function() {
                    return JSON.parse(JSON.stringify(this.history)).reverse()
                }
            },
            methods: {
                downloads: function(o) {
                    window.open(o)
                },
                github: function(o) {
                    window.open("https://github.com/Yeuoly/YeuolyDanmuJi/tree/" + o)
                }
            }
        }
          , i = a
          , s = t("2877")
          , r = t("6544")
          , c = t.n(r)
          , l = t("8336")
          , w = t("b0af")
          , u = t("99d9")
          , x = t("a523")
          , f = t("8414")
          , m = t("1e06")
          , b = Object(s["a"])(i, d, e, !1, null, null, null);
        n["default"] = b.exports;
        c()(b, {
            VBtn: l["a"],
            VCard: w["a"],
            VCardText: u["a"],
            VCardTitle: u["b"],
            VContainer: x["a"],
            VTimeline: f["a"],
            VTimelineItem: m["a"]
        })
    }
}]);
//# sourceMappingURL=chunk-2d2259e5.c281fd6d.js.map
