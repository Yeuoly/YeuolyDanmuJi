<template>
  <div>
      <el-input type="textarea"
          class="pb2" 
          v-model="message" 
          :autosize="{ minRows:10 }" 
          placeholder="问题详细描述"
      ></el-input>
      <el-input v-model="email"
          class="pb2"
          placeholder="稍后我们会将处理结果发至您的邮箱"
      >
          <template slot="prepend">
              您的邮箱地址
          </template>
      </el-input>
      <el-button type="primary" 
          class="w20" 
          @click="submit" 
          plain 
          :loading="submitting"
      >提交</el-button>
  </div>
</template>

<script>

import { MessageBox } from 'element-ui';
import Axios from 'axios';
import api from '../settings/api';
import qs from 'querystring';

export default {
    name : 'FeedBack',
    data : () => ({
        message : '',
        email : '',
        submitting : false
    }),
    methods : {
        async submit(){
            try{
                this.submitting = true;
                const { data } = await Axios.post(api.yeuoly_feedback,qs.stringify({
                    email : this.email,
                    project : 1,
                    message : this.message,
                }));
                if(data['data']['res'] === -250){
                    MessageBox.alert(data['data']['error']).finally( () => {
                        this.submitting = false;
                    });
                }else{
                    MessageBox.confirm('发送成功，求你们了大哥哥，不要炸服啊QAQ').finally( () => {
                        this.submitting = false;
                    });
                }
            }catch(e){
                MessageBox.alert('与服务器连接出错').finally( () => {
                    this.submitting = false;
                });
            }
        }
    }
}
</script>