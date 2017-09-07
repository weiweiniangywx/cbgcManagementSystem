<template>
  <div class="treelist" >

    <table stripe :data="item" style="width: 95%">
      <tr >
        <td style="width: 25%" class="folderName"> <a v-if="isFolder" @click="toggle()">{{open ? '	\u25BC' : '	\u25BA'}}{{item.menuName}}</a>
          <a v-else >{{item.menuName}}</a></td>
        <td type="number" style="width:10%;" v-model="item.menuId">{{item.menuId}}</td>
        <td v-model="item.menuClass" style="width:15%;">{{item.menuClass}}</td>
        <td v-model="item.menuUrl" style="width:25%;">{{item.menuUrl}}</td>
        <td v-model="item.menuOrder" style="width:10%;">{{item.menuOrder}}</td>
        <!--<td v-model="item.menuName" style="width:15%;" class="menuFolder">
          {{item.menuName}}</td>-->
        <td style="width: 15%"><i-Button @click="changeBox()">编辑</i-Button>
          <Modal
            title="编辑菜单"
            ok-text="保存"
            cancel-text="取消"
            @on-ok="okChangeMenu"
            v-model="modal99"
            :styles="{top: '20px'}">
            <div class="boxContent">
              <span>父菜单</span>
              <Select v-model="parentMenu"   style="width: 180px;">
                <Option  v-for="item in menuNames"  :value="item.value" :key="1" style="text-align: left">{{ item.label }}</Option>
              </Select><br /><br />
              <span>菜单名称</span>
              <Input class="boxInput" style="width: 180px;" v-model="changeMenuName"  /><br /><br />
              <span>菜单地址</span>
              <Input class="boxInput" style="width: 180px" v-model="changeMenuUrl"  /><br /><br />
              <span>菜单Class</span>
              <Input class="boxInput" style="width: 180px" v-model="changeMenuClass" /><br /><br />
              <span>菜单序号</span>
              <Input class="boxInput" style="width: 180px" v-model="changeMenuOrder"  />
            </div>
          </Modal>
          <i-Button  @click="delItem">删除</i-Button>
          <Modal
            title="删除角色"
            ok-text="确定"
            cancel-text="取消"
            v-model="delMenu"
            @on-ok="okDel"
            :styles="{top: '20px'}">

            <div class="boxContent">
              <span>确定删除该菜单吗？删除后不可恢复！</span>
            </div>
          </Modal>

        </td>
      </tr>
    </table>
    <ul v-show="open" v-if="isFolder">
      <treelist v-for="(val, index) in item.subMenu" :item="val" @click="delItem" :key="1"></treelist>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    name:'treelist',
    props: {
      item: Object
    },
    data: function() {
      return {
        open: true,
        modal99:false,
        changeMenuName:'',
        changeMenuUrl: '',
        changeMenuClass:'',
        changeMenuOrder:'',
        parentMenu:'',
        selectMenus:[],
        selectedMenu:'',
        delMenu:false,
        menuNames:[],

      }
    },
    computed: {
      isFolder: function() {
        return this.item.subMenu && this.item.subMenu.length
      },
    },

    methods: {

      toggle: function() {
        if (this.isFolder) {
          this.open = !this.open
        }
      },
      changeBox: function () {
        this.parentMenu=this.item.parentMenu.menuId;
        this.changeMenuName = this.item.menuName;
        this.changeMenuUrl =this.item.menuUrl;
        this.changeMenuClass = this.item.menuClass;
        this.changeMenuOrder=this.item.menuOrder;
        getDetailMenuList(this);
      },
      delItem: function(){
        this.delMenu =true;
        this.menuId = this.item.menuId;
      },
      okChangeMenu(){
        var url = '/v2/menu/save';
        var data = {
          menuId:this.item.menuId,
          parentId:this.parentMenu,
          menuName:this.changeMenuName,
          menuUrl:this.changeMenuUrl,
          menuClass:this.changeMenuClass,
          menuOrder:this.changeMenuOrder
        };
        postJq(this,url,data);
      },
      okDel(){
        var url = '/v2/menu/delete';
        var data = {
          menuId:this.menuId
        };
        postJq(this,url,data);
      },
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
        context.modal99 = true;
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
      },
      error:function (error) {
        context.$Loading.error()
      }
    })
  }
</script>

<style scoped>
  a{color: #333; text-decoration: none;}
  table{
    border-collapse: collapse;
    font-size: 14px;
  }
  th, td
  {
    min-width: 0;
    height: 48px;
    box-sizing: border-box;
    text-align: left;
    text-overflow: ellipsis;
    vertical-align: middle;
    border: 1px solid #e3e8ee;
    border-top: none;
  }
  th {
    height: 40px;
    white-space: nowrap;
    overflow: hidden;

  }
  td{
    background-color: #fff;
    padding: 0;
    text-align: center
  }

  .folderName{
    text-align: left;
    padding-left: 5%;
    color: #3C95D5;
  }
  .folderName a{
    color:#3C95D5;
  }

  .treelist ul .treelist>table>tr>td:first-child:before{
    content: '\00A0	\00A0 ';
  }
  .treelist ul .treelist ul .treelist>table>tr>td:first-child:before{
    content: '\00A0	\00A0 \00A0	\00A0 \00A0	\00A0 ';
  }
  .treelist ul .treelist ul .treelist ul .treelist>table>tr>td:first-child:before{
    content: '\00A0	\00A0 \00A0	\00A0 \00A0	\00A0 \00A0	\00A0 \00A0	\00A0 ';
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
