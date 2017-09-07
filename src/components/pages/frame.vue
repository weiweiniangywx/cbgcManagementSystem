<style scoped>
  .sidebar{
    position: fixed;
    height: 100vh;
    width: 180px;
    background-color: #464c5b;
    padding-top: 60px;
  }
  .header{
    height: 60px;
    border-bottom: 1px solid #dddddd;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    background-color: white;
    display: flex;
    z-index: 1000;
  }
  .header .title{
    flex: 0 0 auto;
    line-height: 60px;
    padding-left: 20px;
    font-size: 1.5rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .header .title img{
    width: 40px;
    margin-right: 10px;
  }
  .header .topNav{
    padding-left: 30px;
    flex: 1 1 auto;
  }
  .header .user{
    flex: 0 0 auto;
    padding: 0 10px;
    cursor: pointer;
    border-bottom: 1px solid #dddddd;
    background-color: #e2e2e2;
    line-height: 60px;
  }
  .main{
    padding: 60px 0 0 180px;
    background-color: #f5f7f9;
    min-height: 100vh;
  }
  .sidebar a{
    color: inherit;
  }
</style>
<template>
  <div class="layout">
    <div class="sidebar">
      <siderbar :menus="sideMenu"></siderbar>
    </div>
    <div class="header">
      <div class="title">
        <img src="../../assets/cbgclogo.png">
        川观运营管理系统v2
      </div>
      <div class="topNav">
        <Menu mode="horizontal" theme="light" active-name="1">
          <Menu-item v-for="(item,index) in totalMenu"
                     :key="index+1"
                     :name="index+1" @click.native="changeSideBar(index)">
              {{item.menuName}}
          </Menu-item>
        </Menu>
      </div>
      <Dropdown class="user" trigger="click" placement="bottom-end">
        <div href="javascript:void(0)">
          <Icon type="person" style="padding: 5px"></Icon>
          {{userName}}
        </div>
        <Dropdown-menu slot="list" style="line-height: 1" >
          <Dropdown-item @click.native="modifyPass = true"><Icon type="edit"></Icon> 修改密码</Dropdown-item>
          <Dropdown-item divided @click.native="logOut"><Icon type="power"></Icon> 退出</Dropdown-item>
        </Dropdown-menu>
      </Dropdown>
      <Modal v-model="modifyPass">
        <p slot="header" style="color:#f90">
          <Icon type="information-circled" ></Icon>
          <span>修改密码</span>
        </p>
        <Form ref="password" :model="password" :rules="passwordValidate" :label-width="100" label-position="left">
          <Form-item label="旧密码" prop="oldPass">
            <Input type="password" v-model="password.oldPass"></Input>
          </Form-item>
          <Form-item label="新密码" prop="newPass">
            <Input type="password" v-model="password.newPass"></Input>
          </Form-item>
          <Form-item label="重复新密码" prop="confirm">
            <Input type="password" v-model="password.confirm"></Input>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" :loading="passLoading" @click="handleSubmit('password')">
            <span v-if="!passLoading">修改</span>
            <span v-else>修改中...</span>
          </Button>
          <Button type="ghost"  @click="handleReset('password')" style="margin-left: 8px">重置</Button>
        </div>
      </Modal>
    </div>

    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import sidebar from './common/sidebarNEW.vue'
  export default {
    data () {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if(value.length < 8){
          callback(new Error('密码不能低于8位'));
        } else {
          if (this.password.confirm !== '') {
            // 对第二个密码框单独验证
            this.$refs.password.validateField('confirm');
          }
          callback();
        }
      };
      const validatePassConfirm = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.password.newPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        modifyPass:false,
        passLoading:false,
        userName:'admin',
        password:{
          oldPass:'',
          newPass:'',
          confirm:''
        },
        passwordValidate:{
          oldPass:[
            {required:true,message: '旧密码不能为空', trigger: 'blur'}
          ],
          newPass:[
            {required:true,message: '密码不能为空', trigger: 'blur'},
            {validator:validatePass,trigger: 'blur'}
          ],
          confirm:[
            {required:true,validator:validatePassConfirm, trigger: 'blur'}
          ]
        },
        totalMenu:[],
        sideMenu:[],
        topMenu:[]
      }
    },
    components:{
      siderbar: sidebar
    },
    created(){
        _getUserInfo(this);
        _getMenuTree(this);
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.passLoading = true;
            _changePassword(this,name);
          } else {
            this.$Message.error('请正确填写信息');
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      logOut(){
        window.location.href = this.$BaseUrl+'/logout'
      },
      changeSideBar(index){
          this.sideMenu = this.totalMenu[index].subMenu;
      },
    }
  }

  /**
   * 获取目录结构
   * */
  function _getMenuTree(context){
    context.$.ajax({
      url:context.$BaseUrl+'/v2/menu/getUserMenuTree',
      type:'get',
      success:function (resp) {
        context.totalMenu = resp.data.menus;
        context.topMenu   = resp.data.menus.map(function (item,index) {
          return {
            menuName:item.menuName,
            menuUrl:item.menuUrl,
            index:index
          }
        });
        context.sideMenu  = resp.data.menus[0].subMenu;
      }
    })
  }


  /**
   *获取用户信息
   */
  function _getUserInfo(context) {
    context.$.ajax({
      url:context.$BaseUrl+'/v2/getUserInfo',
      type:'get',
      success:function (data) {
        context.userName = data.data.user.username;
      }
    })
  }
  /**
   * 修改密码
   * */
  function _changePassword(context,name) {
    context.$.ajax({
      url:context.$BaseUrl+'/v2/changePassword',
      type:'post',
      data:{
        oldPassword:context.password.oldPass,
        newPassword:context.password.newPass
      },
      success:function (data) {
        if(data.code < 0){
          context.$Message.error(data.msg);
          context.passLoading = false;
          context.$refs[name].resetFields();
        }else {
          context.$Message.success(data.msg);
          context.$refs[name].resetFields();
          context.passLoading = false;
          context.modifyPass = false;
        }
      }
    })
  }
</script>



