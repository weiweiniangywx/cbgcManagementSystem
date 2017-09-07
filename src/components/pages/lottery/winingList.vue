<style scoped>
</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content ">
      <div style="overflow: hidden">
        <Page :total="itemNumForPage" :page-size="20" style="margin-bottom: 10px;float: right" @on-change="changePage" ></Page>
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
        paths:['首页','运营管理','抽奖','中奖查询'],
        tableData:[],
        itemNumForPage:50,
        tableColumns:[
          {
            title:'id',
            render(h,params){
                return ``+(params.index+1)+``;
            }
          },
          {
            title:'用户名',
            key:'username',
          },
          {
            title:'电话',
            key:'phone',
          },
          {
            title:'中奖时间',
            key:'createDate',
            render(h,params){
              let date = new Date(params.row.createDate).toLocaleString();
              return ``+date+``;
            }
          },
          {
            title:'奖品名称',
            key:'prizename',
          },
          {
            title:'ip',
            key:'ip',
          }
        ]
      }
    },
    created:function(){
        _getWiningList(this,1);
    },
    components:{
        bread:bread
    },
    methods:{
      changePage(page){
          _getWiningList(this,page);
      }
    }
  }

  function _getWiningList(context,page) {
    context.$Loading.start();
    context.$.ajax({
      type:'get',
      url:context.$BaseUrl+'/v2/lottery/winningList',
      data:{
        activityId:context.routeParams.activityId,
        prizeId:context.routeParams.prizeId,
        page:page,
      },
      success(resp){
          context.$Loading.finish();
          context.tableData = resp.data.winners;
          context.itemNumForPage = resp.data.query.totalItem;
      }
    })
  }
</script>
