<style scoped>
</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content ">
      <div style="overflow: hidden">
        <Button type="primary" style="margin-left: 10px" @click="addEnroll">新增活动</Button>
        <Page :total="100" show-elevator style="margin-bottom: 10px;float: right" @on-change="changePage" :page-size="20"></Page>
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
        paths:['首页','运营管理','活动'],
        tableData:[],
        tableColumns:[
          {
            title:'id',
            key:'id',
            width:100
          },
          {
            title:'活动名称',
            key:'title'
          },
          {
            title:'开始时间',
            key:'startDate',
            render(h,params){
              if (params.row.startDate!=null && params.row.startDate!='' && params.row.startDate!='undefined') {
                return new Date(params.row.startDate).toLocaleString()
              }
              else
                return ''
            }
          },
          {
            title:'结束时间',
            key:'endDate',
            render(h,params){
              if (params.row.endDate != null && params.row.endDate != '' && params.row.endDate != 'undefined'){
                return new Date(params.row.endDate).toLocaleString()
            }
              else
                return ''
            }
          },
          {
            title:'状态',
            key:'status',
            render(h,params){
              if (params.row.status==0)
                return '启用'
              else
                return '禁用'
            }
          },
          {
            title:'创建时间',
            key:'gmtCreate',
            render(h,params){
                return new Date(params.row.gmtCreate).toLocaleString()
            }
          },
          {
            title:'更改时间',
            key:'gmtModified',
            render(h,params){
                return new Date(params.row.gmtModified).toLocaleString()
            }

          },
          {
            title:'操作',
            key:'',
            render:(h, params) =>{
              /*return `
                        <i-button @click="edit(row.id)">编辑活动</i-button>
                        <i-button @click="userList(row.id)">参与用户</i-button>
                      `*/
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
                  on: {
                    click: () => {
                      this.userList(params.row.id)
                    }
                  }
                }, '参与用户')
              ]);
            },
            align:'center'
          }
        ]
      }
    },
    created:function(){
      getEnrollList(this,1);
    },
    methods:{
      changePage(page){
        getEnrollList(this,page);
      },
      edit(id){
        this.$router.push({path:'/enroll/addEnroll',query:{enrollActivityId:id}});
      },
      userList(id){
        this.$router.push({path:'/enroll/enrollUser'})
      },
      addEnroll(){
        this.$router.push({path:'/enroll/addEnroll'});
      }
    },
    components:{
      bread:bread
    }
  }
  function getEnrollList(context,page) {
    context.$.ajax({
      type:'get',
      url:context.$BaseUrl+'/enroll/list?p='+page,
      success(resp){
        context.tableData = resp.data.activitys.map(function (item) {
          /*if (item.gmtCreate!=null && item.gmtCreate!='' && item.gmtCreate!='undefined') {
            item.gmtCreate = new Date(item.gmtCreate).toLocaleString()
          }
          if (item.gmtModified!=null && item.gmtModified!='' && item.gmtModified!='undefined') {
            item.gmtModified = new Date(item.gmtModified).toLocaleString()
          }
          if (item.startDate!=null && item.startDate!='' && item.startDate!='undefined') {
            item.startDate = new Date(item.startDate).toLocaleString()
          }
          if (item.endDate!=null && item.endDate!='' && item.endDate!='undefined') {
            item.endDate = new Date(item.endDate).toLocaleString()
          }*/
          return item;
        });
      }
    })
  }
</script>
