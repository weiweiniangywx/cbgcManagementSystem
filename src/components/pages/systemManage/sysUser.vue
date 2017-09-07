<style scoped>
  .boxContent{
    text-align: center;
  }
  .boxContent span{
    position: absolute;
    margin-top: 8px;
    left: 80px;
  }
</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content">
      <div style="overflow:hidden;">
        <span style="padding-left: 15px">用户列表</span>
          <i-Button type="primary" @click="addUser()" style="margin: 10px">新增用户</i-Button>
        <Page :total="2000" show-elevator style="margin: 10px;float: right;" @on-change="changePage" :page-size="20"></Page>
      </div>
      <Table stripe border :columns="columns" :data="sysUserList" style="margin-top: 20px"></Table>

      <Modal
        title="新增用户"
        ok-text="保存"
        cancel-text="取消"
        v-model="addUserShow"
        @on-ok="okAddUser"
        :styles="{top: '20px'}">
        <div class="boxContent">
          <span>用户昵称</span>
          <Input class="boxInput" style="width: 200px;" v-model="addUserNick" placeholder="输入用户昵称"/><br /><br />
          <span>用户姓名</span>
          <Input class="boxInput" style="width: 200px;" v-model="addUserName" placeholder="输入用户姓名"/><br /><br />
          <span>用户密码</span>
          <Input class="boxInput" style="width: 200px;" v-model="addUserPass" placeholder="输入用户密码"/><br /><br />
          <span>行政区划代码</span>
          <Input class="boxInput" style="width: 200px;" v-model="addUserCityCode" :maxlength="6" :number="true" placeholder="输入行政区划代码"/><br /><br />
          <span style="margin-top: 2px;">是否启用</span>
          <Radio-group v-model="addUseToggle" >
            <Radio label="启用"></Radio>
            <Radio label="禁用"></Radio>
          </Radio-group>
        </div>
      </Modal>
      <Modal
        title="编辑用户"
        ok-text="保存"
        cancel-text="取消"
        v-model="editUserShow"
        @on-ok="okEditUser"
        :styles="{top: '20px'}">
        <div class="boxContent">

          <span>用户昵称</span>
          <Input class="boxInput" style="width: 200px;" v-model="editUserNick"/><br /><br />
          <span>用户姓名</span>
          <Input class="boxInput" style="width: 200px;" v-model="editUserName"/><br /><br />
          <span>用户密码</span>
          <Input class="boxInput" style="width: 200px;" v-model="editUserPass" placeholder="输入用户密码，留空则不修改"/><br /><br />
          <span>行政区划代码</span>
          <Input class="boxInput" style="width: 200px;" v-model="editUserCityCode" :maxlength="6" :number="true" placeholder="输入行政区划代码"/><br /><br />

          <span>是否启用</span>
          <Radio-group v-model="useToggle">
            <Radio label="启用"></Radio>
            <Radio label="禁用"></Radio>
          </Radio-group>
          <br />
        </div>
      </Modal>
      <Modal
        title="编辑用户角色"
        ok-text="保存"
        cancel-text="取消"
        v-model="editUserRoleShow"
        @on-ok="okEditUserRole"
        :styles="{top: '20px'}">
        <div class="boxContent">
          <Checkbox-group v-model="firstMenu">
            <Checkbox v-for="(item,index) in totalMenu" :label="item.roleId" :key="index+1">{{item.roleName}}</Checkbox>
          </Checkbox-group>
        </div>
      </Modal>
      <Modal
        title="删除角色"
        ok-text="确定"
        cancel-text="取消"
        v-model="delUserShow"
        @on-ok="okDelUser"
        :styles="{top: '20px'}">
        <div class="boxContent">
          <span>确定删除该用户吗？删除后不可恢复！</span>
        </div>
      </Modal>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  export default {
    data(){
      return{
        columns:[
          {
            title:'用户ID',
            key:'userId',
            align: 'center'
          },
          {
            title:'用户NICK',
            key:'nick'
          },
          {
            title:'用户姓名',
            key:'username'
          },
          {
            title:'用户状态',
            key:'status'
          },
          {
            title:'最后一次登录时间',
            key:'lastLogin'
          },
          {
            title:'最后一次登录IP',
            key:'ip'
          },
          {
            title:'操作',
            key:'',
            width:'30%',
            align:'center',
            render: (h,params) => {
              if (params.row.status == '启用') {
                return h('div', [
                  h('Button', {
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.editUser(params.index)
                      }
                    }
                  }, [
                    h('Icon', {
                      props: {
                        type: 'compose'
                      }
                    }),
                    '编辑']),
                  h('Button', {
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.editUserRole(params.index)
                      }
                    }
                  }, [
                    h('Icon', {
                      props: {
                        type: 'key'
                      }
                    }), '编辑角色']),
                  h('Button', {
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.stopUser(params.index)
                      }
                    }
                  }, [
                    h('Icon', {
                      props: {
                        type: 'pause'
                      }
                    }), '禁用']),
                  h('Button', {
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.delUser(params.index)
                      }
                    }
                  }, [
                    h('Icon', {
                      props: {
                        type: 'trash-a'
                      }
                    }), '删除']),
                ]);
              }
              else {
                let  _that = this;
                return h('div', [
                  h('Button', {
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.editUser(params.index)
                      }
                    }
                  }, [
                    h('Icon', {
                      props: {
                        type: 'compose'
                      }
                    }),
                    '编辑']),
                  h('Button', {
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.editUserRole(params.index)
                      }
                    }
                  }, [
                    h('Icon', {
                      props: {
                        type: 'key'
                      }
                    }),'编辑角色']),
                  h('Button', {
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.stopUser(params.index)
                      }
                    }
                  }, [
                    h('Icon', {
                      props: {
                        type: 'ios-play'
                      }
                    }),'启用']),
                  h('Button', {
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.delUser(params.index)
                      }
                    }
                  }, [
                    h('Icon', {
                      props: {
                        type: 'trash-a'
                      }
                    }),'删除']),
                ]);}
            }
          }],
        sysUserList:[],
        paths:['首页','系统安全' ,'用户列表'],
       // username: '',
        addUserShow:false,
        addUserNick:'',
        addUserName:'',
        addUserPass:'',
        addUseToggle:'',
        addUserCityCode:'',
        userId:'',
        editUserShow:false,
        editUserNick:'',
        editUserName:'',
        editUserPass:'',
        editUserCityCode:'',
        useToggle:'禁用',
        editUserRoleShow:false,
        totalMenu:[],
        firstMenu:[],
        delUserShow:false,
        page:'',
      }
    },
    methods:{
      addUser(){
        this.addUserShow = true;
      },
      okAddUser(){
        var postStatus = this.addUseToggle;
        if (postStatus=='启用'){
          postStatus=0
        }
        else {
          postStatus=-1
        }
        var url = '/v2/sysuser/save';
        var data = {
          nick:this.addUserNick,
          username:this.addUserName,
          password:this.addUserPass,
          cityCode:this.addUserCityCode,
          status:postStatus
        };
        //console.log(data);
        postListJq(this,url,data);
      },
      changePage(page){
        getSysUserList(this,page);
        this.page = page;
      },
      editUser(index){
        this.userId = this.sysUserList[index].userId;
        this.editUserNick = this.sysUserList[index].nick;
        this.editUserName = this.sysUserList[index].username;
        this.useToggle = this.sysUserList[index].status;
        this.editUserShow = true;
      },
      okEditUser(){
        var postStatus = this.useToggle;
        if (postStatus=='启用'){
          postStatus=0
        }
        else {
          postStatus=-1
        }
        var url = '/v2/sysuser/save';
        var data = {
          userId:this.userId,
          nick:this.editUserNick,
          username:this.editUserName,
          password:this.editUserPass,
          cityCode:this.editUserCityCode,
          status:postStatus
        };
        //console.log(data);
        postListJq(this,url,data);
      },
      editUserRole(index){
        this.firstMenu=[];
        getUserRole(this,this.sysUserList[index].userId);
        this.userId = this.sysUserList[index].userId
      },
      okEditUserRole(){

        var url = '/v2/sysuser/userRole';
        var data = {
          userId:this.userId,
          roleIds:this.firstMenu
        };
        postListJq(this,url,data);
      },
      stopUser(index){
        this.userId = this.sysUserList[index].userId;
        var postStatus = this.sysUserList[index].status;
        if (postStatus==='启用'){
          postStatus=-1
        }
        else {
          postStatus=0
        }

        var url = '/v2/sysuser/changeStatus';
        var data = {
          userId:this.userId,
          status:postStatus
        };
        postListJq(this,url,data);
      },
      delUser(index){
        this.delUserShow = true;
        this.userId = this.sysUserList[index].userId;
      },
      okDelUser(){
        var url = '/v2/sysuser/delete';
        var data = {
          userId:this.userId
        };
        postListJq(this,url,data);
      }
    },
    created:function () {
      getSysUserList(this,1);
    },
    components:{
      bread:bread
    }
  }


  function getUserRole(context,index){
    context.$Loading.start();
    context.$.ajax({
      url:context.$BaseUrl+'/v2/sysuser/userRole?userId='+index,
      type:'get',
      success:function (data) {

        context.totalMenu = data.data.roles;
        context.totalMenu.map(function (item,index) {
          if(item.hasRole){
            context.firstMenu.push(item.roleId);
          }
        })
        context.editUserRoleShow= true;
        context.$Loading.finish();
      }
    })
  }
  function postListJq(context,url,data) {
    context.$Loading.start();
    context.$.ajax({
      url:context.$BaseUrl+url,
      type:'post',
      contentType:'application/x-www-form-urlencoded',
      xhrFields: {
        withCredentials: true
      },
      data:data,
      success:function (resp) {
        context.$Message.success(resp.msg);
        context.$Loading.finish();
        getSysUserList(context,context.page);
      },
      error:function (error) {
        context.$Loading.error()
      }
    })
  }

  function getSysUserList(context,page){
      context.$Loading.start();
      context.$.ajax({
        url: context.$BaseUrl + '/v2/sysuser?page=' + page,
        data:{roleId:context.$route.query.roleId},
        type: 'get',
        success: function (data) {
          context.sysUserList = data.data.users;

          for (var i = 0; i < context.sysUserList.length; i++) {
            if (context.sysUserList[i].status == 0) {
              context.sysUserList[i].status = '启用'
            }
            else {
              context.sysUserList[i].status = '禁用'
            }
          }
          context.$Loading.finish();
        }
      })

  }

</script>
