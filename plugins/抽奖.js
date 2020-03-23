window.createPlugin({
    label : '抽奖',                 //必须
    name : 'LuckDarw',              //必须
    id : 0,                         //必须
    el_id : 'LuckDarw',             //必须
    default_boot : true,            //必须
    boot : false,                   //必须
    el : null,
    run(controller){                //必须
        this.el = new controller.Vue({
            template : `
                <el-row>
                    <el-col :span="24">
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
            }),
            methods: {
                draw(){
                    const i = parseInt(Math.random() * ( this.users.length ));
                    this.target = this.users[i];
                },
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
            },
        });
        this.boot = true;
    },
    mount(){                        //必须
        this.el.$mount('#' + this.el_id);
    }
});