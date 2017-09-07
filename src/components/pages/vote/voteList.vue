<style>

</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content">
      <Button type="primary" style="margin-bottom: 10px" @click="addVoteActivity">新增活动</Button>
      <Table size="small" stripe border :columns="tableColumns" :data="tableData"></Table>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  export default {
    data:function(){
      return{
        tableData:[],
        tableColumns:[
          {
            title:'id',
            key:'id',
            width:50
          },
          {
            title:'活动名称',
            key:'title'
          },
          {
            title:'开始时间',
            key:'startDate',
            width:200,
            render(h,params){
                return new Date(params.row.startDate).toLocaleString()
            }
          },
          {
            title:'结束时间',
            key:'endDate',
            width:200,
            render(h,params){
              return new Date(params.row.endDate).toLocaleString()
            }
          },
          {
            title:'每日票数',
            key:'dailyAllCount',
            width:100
          },
          {
            title:'单项票数',
            key:'dailyPerCount',
            width:100
          },
          {
            title:'操作',
            align:'center',
            width:300,
            render:(h, params) =>{
              return h('div', [
                h('Button', {
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.edit(params.row.id)
                    }
                  }
                }, '编辑活动'),
                h('Button', {
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.addItem(params.row.id)
                    }
                  }
                }, '添加选手'),
                h('Button', {
                  on: {
                    click: () => {
                      this.viewItems(params.row.id)
                    }
                  }
                }, '查看选手')
              ]);
            }
          }
        ],
        paths:['首页','运营管理','投票','投票活动列表']
      }
    },
    created:function(){
        _getVoteList(this,1)
    },
    components:{
      bread:bread
    },
    methods:{
      changePage(page){
        getList(this,page);
      },
      edit(id){
         this.$router.push({path:'/vote/addUpdate',query:{voteActivityId:id}});
      },
      addItem(id){
        this.$router.push({path:'/vote/addItem',query:{voteActivityId:id}});
      },
      viewItems(id){
        this.$router.push({path:'/vote/voteItemList',query:{voteActivityId:id}});
      },
      addVoteActivity(){
        this.$router.push({path:'/vote/addUpdate'});
      }
    }
  }
  function _getVoteList(context,page) {
    context.$Loading.start();
    context.$.ajax({
      type:'get',
      url:context.$BaseUrl+'/vote/list?p='+page,
      success(resp){
        context.$Loading.finish();
        context.tableData = resp.data.activitys;
      }
    })
  }
</script>
