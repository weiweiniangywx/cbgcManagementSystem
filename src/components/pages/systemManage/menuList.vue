<style scoped>
  .head{
    padding: 0 20px;
    /*margin: 0 20px;*/
    border-collapse: collapse;
    font-size: 14px;
  }
  th{
    border: 1px solid #e3e8ee;
    height: 40px;
    text-overflow:ellipsis;
}
  .boxContent{
    text-align: center;
  }
  .boxContent span{
    position: absolute;
    margin-top: 8px;
    left: 100px;
  }
</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content">
      <span style="padding-left: 15px">菜单列表</span>
      <i-Button type="primary" @click="addMenu()" style="margin: 10px">新增菜单</i-Button>
      <i-Button type="primary" @click="newMenu()">刷新</i-Button>
      <Modal
        title="新增菜单"
        ok-text="保存"
        cancel-text="取消"
        v-model="addMenuShow"
        @on-ok="okAddMenu"
        :styles="{top: '20px'}">
        <div class="boxContent">
          <span>父菜单</span>
          <Select v-model="selectName" filterable  style="width: 180px;">
            <Option  v-for="item in menuNames"  :value="item.value" :key="item" style="text-align: left">{{ item.label }}</Option>
          </Select><br /><br />
          <span>菜单名称</span>
          <Input class="boxInput" style="width: 180px;" v-model="addMenuName" placeholder="这里输入菜单名称" /><br /><br />
          <span>菜单地址</span>
          <Input class="boxInput" style="width: 180px;" v-model="addMenuUrl" placeholder="这里输入菜单地址" /><br /><br />
          <span>菜单Class</span>
          <Input class="boxInput" style="width: 180px;" v-model="addMenuClass" placeholder="这里输入菜单Class" /><br /><br />
          <span>菜单序号</span>
          <Input class="boxInput" style="width: 180px;" v-model="addMenuOrder" placeholder="这里输入菜单序号" /><br /><br />
        </div>
      </Modal>
<div style="padding: 0 20px">
      <table class="head" style="width: 95%;" >

        <thead>
          <tr>
            <th style="width: 25%" >菜单名称</th>
            <th style="width: 10%">菜单编号</th>
            <th style="width: 15%">菜单Class</th>
            <th style="width: 25%">菜单地址</th>
            <th style="width: 10%">菜单排序</th>
            <th style="width: 15%">操作</th>
          </tr>
        </thead>
      </table>
</div>
      <treelist   v-for="(val, index) in items" :item="val" style="padding: 0 20px" :key="index+1">
      </treelist>

    </div>



  </div>
</template>

<script type="text/ecmascript-6">

  import treelist from '../common/treelist.vue'
  import bread from '../common/Breadrumb.vue'
  export default {
    data:function(){
      return{
        modal9: false,
        selectName:'',
        readers:[],
        readerWorkPath:'',
        resourceIndex:1,
        type:'video',
        isMediaShow:false,
        paths:['首页','系统管理','菜单管理'],
        items: [
        ],
        addMenuShow:false,
        addMenuName:'',
        addMenuUrl:'',
        addMenuClass:'',
        addMenuOrder:'',
        menuNames:[],
      }
    },

    methods:{

      addMenu(){
        getDetailMenuList(this);
      },
      newMenu(){
        getMenuList(this);
      },
      okAddMenu() {
        var url = '/v2/menu/save';
        var data = {
          parentId:this.selectName,
          menuName:this.addMenuName,
          menuUrl:this.addMenuUrl,
          menuClass:this.addMenuClass,
          menuOrder:this.addMenuOrder
        };
        postJq(this,url,data);
      },
    },
    created:function(){
      getMenuList(this);
    },
    components:{
      bread, treelist
    }
  }
  function getDetailMenuList(context){
    context.$.ajax({
      url:context.$BaseUrl+'/v2/menu/getMenuTree',
      type:'get',
      success:function (data) {
        var selecmenu = data.data.menus;
        context.menuNames = [{label:'顶级菜单',value:0}];
        for (var item in selecmenu) {
          context.menuNames.push({label:'-----/'+selecmenu[item].menuName,value:selecmenu[item].menuId});
          for (var item1 in selecmenu[item].subMenu) {
            context.menuNames.push({label:'-----/-----/'+selecmenu[item].subMenu[item1].menuName,value:selecmenu[item].subMenu[item1].menuId});
          }
        }
        context.addMenuShow=true;
      }
    })
  }
  function getMenuList(context) {
    context.$.ajax({
      url:context.$BaseUrl+'/v2/menu/getMenuTree',
      type:'get',
      success:function (data) {
        var data = data.data;
        context.items = data.menus;
      }
    })
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
        getMenuList(context);
      },
      error:function (error) {
        context.$Loading.error()
      }
    })
  }
</script>
