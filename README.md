# 插件系统
## 创建接口
YeuolyDanmu提供了一个全局接口 createPlugin
其参数为插件对象

### 参数
```
window.createPlugin({
    label : '插件中文名',
    name : '英文名',
    id : 0
    el_id : 'plugin_name' 
    default_boot : true,
    boot : false,
    run(controller){ /* do something */ },
    mount(){ /* do something */ }
});
```
解释一下各个参数的含义
1. label name：插件中英文名，这个会显示在插件界面
2. id : 插件id，随便填，只要不重复就行，所以建议起得奇怪一点
3. el_id : 挂载插件时dom的id，其实就是一个 div的id，会把插件界面挂载到这个dom上
4. default_boot：自动启动，当开启后，在YeuolyDanmu启动时会自动启动该插件
5. boot：是否已经启动，这个需要根据run内的逻辑来更改，如果启动，插件系统会挂载该插件的UI
6. run(controller)：启动插件的方法，在启动插件时YeuolyDanmu会调用该方法，其参数controller如下
```
controller : {
  setListenner : function(channel, cb),
  removeListenner : function(channel, cb),
  Vue : Class,
  helper : {
    HashList : Class,
    axios : Object,
    console : Object
    getAvatar : function
  }
}
```
其中 setListenner用来设置监听器，其参数channel可以为[ 'danmu', 'guard', 'sc' , 'gift', 'log']中的一个，cb为回调函数，当设置好监听器后，YeuolyDanmu会将消息作为第一个参数传入cb中
removeListenner与setListenner正好相反

7. mount()：挂载方法，YeuolyDanmu会调用它来挂载UI，YeuolyDanmu事先准备好了一个div，其ID为之前设置的el_id，我们只需要使用类似
```
const dom = document.createElement('div');
/*
  对dom绑定好插件相关的事件之类的东西
**/
document.getElementById('#'+this.el_id).appendChild(dom);
```
这样子挂载就好了
各位可能注意到了，我在controller中提供了Vue，是的，这个项目基于Vue开发，所以各位可以直接使用Vue来创建插件，下面给一个例子
```
window.createPlugin({
  label : '记录启动时间',
  name : 'timer',
  id : 114514,
  el_id : 'timer',
  el : null,
  default_boot : true,
  boot : false,
  run(controller){
    this.el = new controller.Vue({
      template : '<div>已经启动了{{time}}秒</div>',
      data : () => ({
        time : 0
      }),
      created(){
        setInterval(() => { this.time++; },1000);
      }
    });
    this.boot = true;
  },
  mount(){
    this.el.$mount('#'+this.el_id);
  }
});
```
这就是一个简单的创建插件的例子，它会记录弹幕姬启动到现在的时间
那么如何使用原生js来实现这个插件呢？如下
```
window.createPlugin({
  label : '记录启动时间',
  name : 'example',
  id : 114514,
  el_id : 'example',
  data : {
    time : 0
  },
  default_boot : true,
  boot : false,
  console : null,
  run(controller){
    this.console = controller.helper.console;
    this.timer = setInterval(() => { this.data.time++; }, 1000);
    this.boot = true;
  },
  mount(){
    try{
      const dom = document.getElementById(this.el_id);
      dom.innerHTML = '已经启动了' + this.data.time + '秒';
      this.console.log('Example',this.data.time);
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.data.time++;
        dom.innerHTML = '已经启动了' + this.data.time + '秒';
      },1000);
    }catch(e){
      this.console.error('Example',e);
    }
  }
});
```
这只是数据少的情况下，原生js就已经看着很蹩脚了，而且我这里做了简单处理，时间并不准确，一旦逻辑和数据复杂起来原生js是很难顶的，所以这里还是建议使用框架，我这里只提供了Vue，各位使用React或者Angular的可以先载入它们的源文件，这里建议直接把他们丢到插件文件夹中就行了，YeuolyDanmu会自动载入的

我这里简单介绍了一下怎么使用console，console我提供了log error waring三个方法，其第一个参数是所处模块的模块名，比如这个例子的模块名就叫Example，第二个参数为消息本体，log还提供了第三个参数color，可以取green red grey，所有日志信息都会在YeuolyDanmu的日志界面中显示，调试的时候就可以使用try catch配合console来完成

再说一下getAvatar，我就直接放一个例子吧，应该看得懂
```
getAvatar(用户uid, 头像链接 => {
  用户.头像链接 = 头像链接;
});
```
#### 以上就是YeuolyDanmu的创建插件向导，如果还有不会的话可以联系我，邮箱：admin@yeuoly.moe
