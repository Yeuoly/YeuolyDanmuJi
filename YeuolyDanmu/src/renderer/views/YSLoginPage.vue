<template>
    <div id="login-page" class="w60">
        <el-input type="text" 
            class="py3" 
            v-model.lazy="model.email"
            placeholder="请输入您的注册邮箱"
        >
            <template slot="prepend">
                邮箱
            </template>
        </el-input>
        <el-input type="password" 
            class="py3" 
            v-model.lazy="model.password"
            placeholder="请输入您的密码"
        >
            <template slot="prepend">
                密码
            </template>
        </el-input>
        <div class="w100 pb3">
            <el-button @click="login" 
                type="primary"
                class="w100"
                :disabled="!allow"
                :loading="loading"
            >登录</el-button>
        </div>
        <div class="w100 pb3">
            <el-button @click="retrievePassword" 
                type="info"
                class="w100"
            >找回密码</el-button>
        </div>
    </div>
</template>

<script>
import { MessageBox } from 'element-ui';
import qs from 'querystring';
import axios from 'axios';
import api from '../settings/api';
import Account from '../data/user';

export default {
    data : () => ({
        model : {
            email : '',
            password : ''
        },
        loading : false,
    }),
    methods: {
        async login(){
            this.loading = true;
            try{
                const { data } = axios.post(api.yeuoly_account_ordinary_action,qs.stringify({
                    email : this.model.email,
                    password : this.model.password,
                    act : 2
                }));
                if(data['data']['res'] === 666){
                    MessageBox.confirm('登录成功','登录').then(() => {
                        Account.init();
                    });
                }else{
                    MessageBox.alert(data['data']['error'],'登录');
                }
            }catch(e){
                MessageBox.alert('与服务器连接出错','YeuolySystem');
            }
            this.loading = false;
        },
        retrievePassword(){
            
        }
    },
    computed: {
        allow(){
            return !!this.model.email.match(/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\\.-])+\.([A-Za-z]){2,4}$/g) &&
                   !!this.model.password.match(/[a-zA-Z0-9\-.+@#$%^&*[\]]{6,16}/g);
        }
    },
}
</script>

<style>
#login-page{
    margin: 0 auto;
}

</style>