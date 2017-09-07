<style scoped>
</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content ">
      <div style="overflow: hidden">
        <Page :total="1000" :pageSize="20" style="margin-bottom: 10px;float: right" @on-change="changePage" ></Page>
      </div>
      <Table ref="table" stripe border :columns="tableColumns" :data="tableData"></Table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  export default {
    data:function(){
      return{
        routeParams:this.$route.query,
        paths:['首页','运营管理','抽奖','参与用户'],
        tableData:[],
        tableColumns:[
          {
            title:'id',
            key:'id'
          },
          {
            title:'用户名',
            key:'name',
          },
          {
            title:'电话',
            key:'phone',
          },
          {
            title:'参与时间',
            key:'createDate',
            render(h,params){
              let date = new Date(params.row.createDate).toLocaleString();
              return ``+date+``;
            }
          },
          {
            title:'名称',
            width:400,
            render(h,params){
                return h('div',[
                    h('div','会员名:'+params.row.memberName),
                    h('div','设备:'+params.row.device)
                ])

            }
          },
          {
            title:'ip',
            key:'ip',
            width:200
          }
        ]
      }
    },
    created:function(){
        _getUserList(this,1);
    },
    components:{
        bread:bread
    },
    methods:{
      changePage(page){
        _getUserList(this,page);
      }
    }
  }

  function _getUserList(context,page) {
    context.$Loading.start();
    context.$.ajax({
      type:'get',
      url:context.$BaseUrl+'/v2/lottery/user/list',
      data:{
        activityId:context.routeParams.activityId,
        p:page,
      },
      success(resp){
          context.$Loading.finish();
          context.tableData = resp.data.users;
      }
    })
  }
</script>
