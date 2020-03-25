window.createPlugin({
<<<<<<< HEAD
    label : '抽奖',                 //必须
    name : 'LuckDarw',              //必须
    id : 0,                         //必须
    el_id : 'LuckDarw',             //必须
=======
    label : '弹幕抽奖',              //必须
    name : 'YeuolyLuckDarw',        //必须
    id : 3271587,                   //必须
    el_id : 'YeuolyLuckDarw',       //必须
>>>>>>> 23d4b4e78a01852798e2884cca3c2cc66ba699dd
    default_boot : true,            //必须
    boot : false,                   //必须
    el : null,
    run(controller){                //必须
<<<<<<< HEAD
=======
        const UserCard = {
            template : `
                <div class="px3 py3">
                    <div class="luckdarw-usercard">
                        <img class="luckdarw-face" :src="face"/>
                        <span class="luckdarw-uname text-20 text-white">{{id}}</span>
                        <span class="luckdarw-uid text-11 text-white">{{uid}}</span>
                    </div>
                </div>
                `,
            name : 'UserCard',
            props : ['face','id','uid']
        }
>>>>>>> 23d4b4e78a01852798e2884cca3c2cc66ba699dd
        this.el = new controller.Vue({
            template : `
                <el-row>
                    <el-col :span="24">
<<<<<<< HEAD
                        <el-button small plain @click="draw">一发入魂</el-button>
                        天选之子是：{{target.id}}，uid为{{target.uid}}
                    </el-col>
                    <el-col :span="6" v-for="i in users">
                        <div class="py-3">ID:{{i.id}}</div>
                    </el-col>
                </el-row>
            `,
            data : () => ({
                users : [],
                target : { id : '', uid : 0, face : ''},
                hash : new controller.helper.HashList(1)
=======
                        <el-button-group>
                            <el-button plain type="primary" :disabled="start" @click="setup">开始记录</el-button>
                            <el-button plain type="danger" :disabled="!start" @click="uni">停止记录</el-button>
                            <el-button plain type="primary" :disabled="users.length === 0" @click="draw">一发入魂</el-button>
                            <el-button plain type="danger" @click="clear">清空全部</el-button>
                        </el-button-group>
                        <span class="text-grey text-16 pl3" style="font-family:'DanmuFont'">参加人数：{{users.length}}</span>
                    </el-col>
                    <el-col :span="24">
                        <UserCard class="w60"
                                  v-if="target"
                                  :face="target.face"
                                  :uid="target.uid"
                                  :id="target.id"
                        />
                    </el-col>
                    <el-col :span="8" v-for="i in users">
                        <UserCard v-if="i"
                                  :face="i.face"
                                  :uid="i.uid"
                                  :id="i.id"
                        />
                    </el-col>
                </el-row>
            `,
            components : { UserCard },
            data : () => ({
                users : [],
                target : null,
                hash : new controller.helper.HashList(1),
                start : false,
>>>>>>> 23d4b4e78a01852798e2884cca3c2cc66ba699dd
            }),
            methods: {
                draw(){
                    const i = parseInt(Math.random() * ( this.users.length ));
                    this.target = this.users[i];
                },
<<<<<<< HEAD
                init(){
                    controller.setListenner('danmu', danmu => {
                        const user = danmu.user;
                        if(this.hash.operate(user.uid).insert({ uid : user.uid, id : user.id }).result){
                            this.users.push({
                                id : user.id,
                                uid : user.uid
                            });
                        }
                    });
                }
            },
            created() {
                this.init();
=======
                loadUser(danmu){
                    const user = danmu.user;
                    if(this.hash.operate(user.uid).insert({ uid : user.uid, id : user.id }).result){
                        controller.helper.getAvatar(user.uid, src => {
                            this.users.push({
                                face : src,
                                id : user.id,
                                uid : user.uid
                            });
                        });
                    }
                },
                clear(){
                    this.target = null;
                    this.users = [];
                    this.hash = new controller.helper.HashList(1);
                },
                setup(){
                    this.start = true;
                    controller.setListenner('danmu',this.loadUser);
                },
                uni(){
                    this.start = false;
                    controller.removeListenner('damu',this.loadUser);
                }
            },
            created() {
                controller.Vue.component()
>>>>>>> 23d4b4e78a01852798e2884cca3c2cc66ba699dd
            },
        });
        this.boot = true;
    },
    mount(){                        //必须
        this.el.$mount('#' + this.el_id);
    }
});