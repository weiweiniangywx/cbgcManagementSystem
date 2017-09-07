<style scoped>
 /* body,html{
    height: 100%;
  }*/
  .login-wrap{
    display: inline-block;
    height: 100vh;
    width: 100%;
    background-color: white;
    text-align: center;
  }
  .login-box{
    padding: 25px;
    display: inline-block;
    background-color: #464c5b;
    margin: 120px 0 0 0;
    border-radius: 5px;
  }
  .login-box h1{
    color: #fff;
    text-align: center;
    margin-bottom: 30px;
  }
  .verifyCodeBox{
    margin-bottom: 24px;
  }
</style>

<template>
  <div class="login-wrap">
      <div class="login-box">
        <Form ref="formInline" :model="loginInfo" :rules="rules" >
          <h1>运营管理系统登录</h1>
          <Form-item prop="username">
            <Input type="text" v-model="loginInfo.username" placeholder="用户名">
            <Icon type="ios-person-outline" size="18" slot="prepend"></Icon>
            </Input>
          </Form-item>
          <Form-item prop="password">
            <Input type="password" v-model="loginInfo.password" placeholder="密码">
            <Icon type="ios-locked-outline" size="18" slot="prepend"></Icon>
            </Input>
          </Form-item>
          <Form-item prop="code">
            <Input type="text" v-model="loginInfo.code" placeholder="验证码">
            <Icon type="ios-locked-outline" size="18" slot="prepend"></Icon>
            <span slot="append"><img @click="changeImg" style="height: 20px" :src="imgSrc"></span>
            </Input>
          </Form-item>
          <h3 style="margin-bottom: 20px;color: #ccc;">推荐使用<a style="color: #3C95D5" href="https://www.baidu.com/#wd=chrome%20%E4%B8%8B%E8%BD%BD" target="_blank">谷歌Chrome浏览器</a>以获取更佳体验！</h3>
          <Form-item>
            <Button id="login" long size="large" type="primary" @click="handleSubmit('formInline')">登录</Button>
          </Form-item>
        </Form>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        loginInfo: {
          username: '',
          password: '',
          code:''
        },
        imgSrc:this.$domain+'/code?t='+Date.parse(new Date()),
        rules: {
          username: [
            { required: true, message: '请填写用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请填写密码', trigger: 'blur' },
          ],
          code: [
            { required: true, message: '请填写验证码', trigger: 'blur'},
            { type: 'string', min: 4, message: '密码长度不能小于4位', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleReset(){
          this.loginInfo.username='';
          this.loginInfo.password='';
          this.loginInfo.code='';
          this.changeImg();
      },
      handleSubmit(name) {
        let that = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            that.$Loading.start();
            that.$.ajax({
              type:'post',
              url:that.$BaseUrl+'/login',
              data:that.loginInfo,
              success(resp){
                  if(resp.code ===1){
                    that.$Loading.finish();
                    that.$router.push({path:'/'});
                  }else{
                    that.$Loading.error();
                    that.changeImg();
                    that.$Notice.error({
                      title: '登录失败',
                      desc: resp.msg,
                      duration: 0
                    });
                  }
              }
            })
          }
        })
      },
      changeImg(){
        this.imgSrc = this.$domain+'/code?t='+Date.parse(new Date());
      }
    },
    mounted(){
      if(window.$ == undefined){
        window.jQuery = window.$ = this.$;
      }
      document.onkeydown = function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==13){
            $('#login').click();
        }
      };
    }
  }
</script>
