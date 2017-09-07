<style scoped>

</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>

    <div class="layout-content">
      <span style="padding-left: 15px">角色列表</span>
      <i-Button type="primary" @click="addManage()" style="margin: 10px">新增角色</i-Button>
      <Modal
        title="新增角色"
        ok-text="保存"
        cancel-text="取消"
        v-model="addRole"
        @on-ok="okAddRole"
        :styles="{top: '20px'}">
        <div class="boxContent">
          <span>角色名称</span>
          <Input class="boxInput" style="width: 180px;" v-model="addRoleName" placeholder="这里输入角色名称" /><br /><br />
        </div>
      </Modal>
      <Table stripe border :columns="columns" :data="manages"></Table>
      <Modal
        title="编辑角色名称"
        ok-text="保存"
        cancel-text="取消"
        @on-ok="okName"
        v-model="chgName"
        :styles="{top: '20px'}">
        <div class="boxContent">
          <span>角色名称</span>
          <Input class="boxInput" style="width: 180px;" v-model="changeMenuName" placeholder="这里输入角色名称" /><br /><br />
        </div>
      </Modal>
      <Modal
        title="编辑菜单"
        ok-text="保存"
        cancel-text="取消"
        v-model="chgMenu"
        @on-ok="okMenu"
        :styles="{top: '20px'}">
        <div class="boxContent">
          <div class="router-content">
            <div class="layout-content custom">

              <Checkbox-group v-model="firstMenu" >
                <Checkbox v-for="(item,index) in totalMenu" :label="item.menuId" :key="index+1" >
                  {{item.menuName}}<br>
                  <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;width: 350px"></div>
                  <Checkbox-group v-model="firstMenu" style="padding-left: 25px;">

                    <Checkbox v-for="(item1,index1) in totalMenu[index].subMenu" :label="item1.menuId" :key="index1+1">
                      {{item1.menuName}}<br/>
                      <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;width: 350px"></div>
                      <Checkbox-group v-model="firstMenu" style="padding-left: 25px;">

                        <Checkbox v-for="(item2,index2) in totalMenu[index].subMenu[index1].subMenu" :label="item2.menuId" :key="index2+1">
                          {{item2.menuName}}

                        </Checkbox>
                      </Checkbox-group><br>
                    </Checkbox>
                  </Checkbox-group><br>

                </Checkbox>
              </Checkbox-group>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="编辑权限"
        ok-text="保存"
        cancel-text="取消"
        v-model="chgPower"
        @on-ok="okPerm"
        :styles="{top: '20px'}">
        <div class="boxContent">
          <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
          </div>
          <Checkbox-group v-model="trueGroup">
            <Checkbox  v-for="(value, key, index) in checkGroup" :label="key" :key="index+1">{{key}}</Checkbox>
          </Checkbox-group>
        </div>
      </Modal>
      <Modal
        title="删除角色"
        ok-text="确定"
        cancel-text="取消"
        v-model="delMana"
        @on-ok="okDel"
        :styles="{top: '20px'}">

        <div class="boxContent">
          <span>确定删除该角色吗？删除后不可恢复！</span>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  export default {
    data:function(){
      return{
        manages:[],
        columns:[
          {
            title:'角色ID',
            key:'roleId'
          },
          {
            title:'角色名称',
            key:'roleName'
          },
          {
            title:'父角色ID',
            key:'parentId'
          },
          {
            title:'操作',
            key:'',
            width:'500',
            render:(h, params) =>{
              return h('div', [
                h('Button', {
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.changeName(params.index)
                    }
                  }
                }, '编辑名称'),
                h('Button', {
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.changeMenu(params.index)
                    }
                  }
                }, '编辑菜单'),
                h('Button', {
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.changePower(params.index)
                    }
                  }
                }, '编辑权限'),
                h('Button', {
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showRoleUser(params.row.roleId)
                    }
                  }
                }, '查看该角色用户'),
                h('Button', {
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delManage(params.index)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        paths:['首页','系统管理','角色管理'],
        chgName:false,
        chgMenu:false,
        chgPower:false,
        delMana:false,
        addRole:false,
        check:[],
        trueGroup:[],
        checkGroup:{},
        changeMenuName:'',
        addRoleName:'',
        roleName:'',
        postRole:[],
        permissionss: {},
        firstMenu:[],
        totalMenu:[]

      }

    },
    created:function(){
      getManageList(this);

    },
    methods:{
      addManage(){
        this.addRole = true;
      },
      changeName (index) {
        this.chgName = true;
        this.roleName = this.manages[index].roleId
      },
      changeMenu(index) {
        this.firstMenu=[];
        getMenuList(this,this.manages[index].roleId);
        this.roleId = this.manages[index].roleId;
      },
      changePower(index) {
        getPermissionList(this,this.manages[index].roleId);
        this.roleId = this.manages[index].roleId;
        this.postRole=this.trueGroup;
      },
      showRoleUser(id){
        this.$router.push({path:'/system/sysUser',query:{roleId:id}});
      },
      delManage(index) {
        this.delMana =true;
        this.roleId = this.manages[index].roleId;
      },
      okMenu(){
        var url = '/v2/role/roleMenu';
        var data = {
          roleId:this.roleId,
          menuIds:this.firstMenu
        };
        postJq(this,url,data);
      },
      okPerm(){
        var url = '/v2/role/rolePermission';
        var data = {
          roleId:this.roleId,
          permissions:this.trueGroup
        };
        postJq(this,url,data);
      },
      okAddRole (){
        var url = '/v2/role/save';
        var data = {
          roleName:this.addRoleName
        };
        postJq(this,url,data);
      },
      okDel(){
        var url = '/v2/role/delete';
        var data = {
          roleId:this.roleId
        };
        postJq(this,url,data);
      },
      okName (){
        var url = '/v2/role/save';
        var data = {
          roleId:this.roleName,
          roleName:this.changeMenuName
        };
        postJq(this,url,data);
      },
    },
    components:{
      bread:bread
    }
  }
  function getMenuList(context,index) {
    context.$Loading.start();
    context.$.ajax({
      /*url:context.$BaseUrl+'/v2/role/roleMenu?roleId='+index,*/
      url:context.$BaseUrl+'/v2/role/roleMenu?roleId='+index,
      type:'get',
      success:function (data) {

        context.totalMenu = data.data.menus;
        context.totalMenu.map(function (item,index) {
          if(item.hasMenu){
            context.firstMenu.push(item.menuId);
          }
          if(item.subMenu.length > 0){

            item.subMenu.map(function (item1,index1) {
              if(item1.hasMenu){
                context.firstMenu.push(item1.menuId);
              }
              if (item1.subMenu.length > 0){
                item1.subMenu.map(function (item2,index2) {
                  if (item2.hasMenu) {
                    context.firstMenu.push(item2.menuId);
                  }
                })
              }
            })
          }
        })
        context.chgMenu= true;
        context.$Loading.finish();
      }
    })
  }
  function getPermissionList(context,index) {
    context.$Loading.start();
    context.$.ajax({
      url:context.$BaseUrl+'/v2/role/rolePermission?roleId='+index,
      type:'get',
      success:function (data) {
        context.checkGroup =data.data.permissions;
        context.chgPower= true;
        context.trueGroup=objOfPropertyTrueToArr(context.checkGroup);
        context.$Loading.finish();
      }
    })
  }
  function getManageList(context) {
    context.$Loading.start();
    context.$.ajax({
      url:context.$BaseUrl+'/v2/role',
      type:'get',
      success:function (data) {
        context.manages =data.data.roles;
        context.$Loading.finish();
      }
    })
  }
  /*将Object的值为true属性输出成Array*/
  function objOfPropertyTrueToArr(object) {
    var arr = [];
    var i = 0;
    for (var item in object) {
      if (object[item]==true) {
        arr[i] = item;
        i++;
      }
    }
    return arr;
  }
  function postJq(context,url,data) {
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
        getManageList(context);
      },
      error:function (error) {
        context.$Loading.error()
      }
    })
  }

</script>
