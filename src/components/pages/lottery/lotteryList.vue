<style scoped>
</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content ">
      <Button type="primary" style="margin-bottom: 10px" @click="addLotteryActivity">新增活动</Button>
      <Table ref="table" stripe border :columns="tableColumns" :data="tableData"></Table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  export default {
    data:function(){
      return{
        paths:['首页','运营管理','抽奖'],
        tableData:[],
        tableColumns:[
          {
            title:'id',
            key:'id',
            width:100
          },
          {
            title:'活动名称',
            key:'name'
          },
          {
            title:'开始时间',
            key:'startDate',
            render(h,params){
                return new Date(params.row.startDate).toLocaleString()
            }
          },
          {
            title:'结束时间',
            key:'endDate',
            render(h,params){
              return new Date(params.row.endDate).toLocaleString()
            }
          },
          {
            title:'初始次数',
            key:'initCount',
            width:100,
          },
          {
            title:'每日次数',
            key:'dailyCount',
            width:100
          },
          {
            title:'操作',
            key:'',
            render: (h,params)=>{

                return h('div',[
                    h('Button',{on:{click:()=>{this.edit(params.row.id)}},style:{'margin-right':'5px'}},'编辑'),
                    h('Button',{on:{click:()=>{this.prizeConfig(params.row.id)}},style:{'margin-right':'5px'}},'配置奖品'),
                    h('Button',{on:{click:()=>{this.winingList(params.row.id)}},style:{'margin-right':'5px'}},'中奖查询'),
                    h('Button',{on:{click:()=>{this.userList(params.row.id)}},style:{'margin-right':'5px'}},'参与用户'),
                    h('Button',{on:{click:()=>{this.reload(params.row.id)}}},'刷新配置'),
                ])

            },
            width:450,
            align:'center'
          }
        ]
      }
    },
    created:function(){
        _getLotteryList(this);
    },
    methods:{
        addLotteryActivity(){
          this.$router.push({path:'/lottery/edit'})
        },
        edit(id){
          this.$router.push({path:'/lottery/edit',query:{activityId:id}})
        },
        prizeConfig(id){
          this.$router.push({path:'/lottery/prizeConf',query:{activityId:id}})
        },
        winingList(id){
          this.$router.push({path:'/lottery/winList',query:{prizeId:-1,activityId:id}})
        },
        userList(id){
          this.$router.push({path:'/lottery/userList',query:{activityId:id}})
        },
        reload(id){
            let that = this;
          this.$.ajax({
            type:'get',
            url:this.$BaseUrl+'/v2/lottery/reload',
            dataType:'json',
            data:{id:id},
            success(resp){
                that.$Message.success(resp.msg);
            }
          })
        }
    },
    components:{
        bread:bread
    }
  }
  function _getLotteryList(context) {
    context.$Loading.start();
    context.$.ajax({
      type:'get',
      url:context.$BaseUrl+'/v2/lottery/list',
      success(resp){
        context.$Loading.finish();
        context.tableData = resp.data.lotterys;
      }
    })
  }
</script>
