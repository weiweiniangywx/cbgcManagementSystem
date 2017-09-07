<style scoped>
  .box{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
  }
  .box > a {
    background-color: #3C95D5;
    padding: 5px 10px;
    color: white;
    border-radius: 4px;
  }
</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content ">
      <Form ref="invite" :model="invite" :rules="inviteRule" inline>
        <Form-item prop="name">
          <Input type="text" v-model="invite.name" placeholder="请输入单位名称">
          <span slot="prepend">邀请码名称</span>
          </Input>
        </Form-item>
        <Form-item prop="code">
          <Input type="text" v-model="invite.code" placeholder="请输入邀请码">
          <span slot="prepend">邀请码</span>
          </Input>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="addCode('invite')">提交</Button>
        </Form-item>
      </Form>
      <span>
        注①：邀请码不区分大小写，为避免个别字母混淆，建议大写<br>
        注②：邀请码名称不包含上一级行政区域，建议包含行政区域的标识，比如"XX县"要比"XX"更规范
      </span>

      <div class="box">
        <h2>
          {{pageInfo.palceName}}邀请码列表(共{{pageInfo.total}}个，总共激活{{pageInfo.activeCode}}个)
        </h2>
        <a :href=downloadUrl><Icon type="android-archive"></Icon> 导出到excel</a>
      </div>

      <Table ref="table" stripe border :columns="tableColumns" :data="tableData"></Table>

      <Modal
        v-model="modal.show"
        :title="modal.name"
        @on-ok="ok"
        @on-cancel="cancel">
        <Input v-model="modal.kpi">
          <span slot="prepend">任务量</span>
        </Input>
      </Modal>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  export default {
    data:function(){
      return{
        modal:{
            show:false,
            name:'',
            id:'',
            kpi:''
        },
        pageInfo:{
          palceName:'',
          total:'',
          activeCode:'',
          level:1
        },
        invite:{
          name:'',
          code:''
        },
        inviteRule:{
          name:[
            { required: true, message: '名称必填', trigger: 'blur' }
          ],
          code:[
            { required: true, message: '邀请码必填', trigger: 'blur' },
            { type: 'string', min: 6, max: 6, message: '邀请码为6位数字/字符', trigger: 'blur' }
          ]
        },
        tableData:[],
        tableColumns:[
            {
              title:'序号',
              key:'id'
            },
            {
              title:'单位名称',
              key:'name'
            },
            {
              title:'邀请码',
              key:'code'
            },
            {
              title:'任务量',
              key:'kpi',
              render:(h,params) => {
                  return h('div',[
                      params.row.kpi,
                      h('Button',{
                          style:{'float':'right'},
                          props:{size:'small'},
                          on:{
                              click:()=>{
                              this.showModify(params.index)
                          }
                          }
                      },'修改')
                  ]);
              }
            },
            {
              title:'激活量',
              key:'count'
            },
            {
              title:'操作',
              width:300,
              align:'center',
              render:(h,params)=>{
                  return h('div',[
                      h('Button',{style:{'margin-right':'5px'},on:{click:()=>{this.goRouter(params.row.id)}}},'添加下一级邀请码'),
                      h('Button',{on:{click:()=>{this.goRouter(params.row.id)}}},'查看下一级'),
                  ])
              }
            }
        ],
        pid:this.$route.query.pid,
        downloadUrl:'',
        paths:['首页','邀请码','统计列表']
      }
    },
    created:function(){
        _getInviteCodeList(this);
        let _pid = this.pid || 0;
        this.downloadUrl = this.$BaseUrl+'/v2/cbgc/inviteCode/export?pid='+_pid;
    },
    components:{
        bread
    },
    methods:{
       goRouter (pid) {
         this.$router.push({path:'/inviteCode/list',query:{pid:pid}})
       },
       addCode (name) {
         let that = this;
         this.$refs[name].validate((valid) => {
           if (valid) {
             that.$.ajax({
               type:'post',
               url:that.$BaseUrl+'/v2/cbgc/inviteCode/add',
               data:{
                  pid:that.pid,
                  name:that.invite.name,
                  code:that.invite.code,
                  level:that.pageInfo.level
               },
               success(resp){
                   that.$Message.success(resp.msg);
               }
             })
           }
         })
       },
       showModify (index) {
           this.modal.name = this.tableData[index].name;
           this.modal.kpi = this.tableData[index].kpi;
           this.modal.id = this.tableData[index].id;
           this.modal.show = true;
       },
       ok () {
          let that = this;
          this.$.ajax({
            type:'post',
            url:this.$BaseUrl+'/v2/cbgc/inviteCode/update',
            data:{
              id:that.modal.id,
              kpi:that.modal.kpi
            },
            success(resp){
                if(resp.code === 1){
                  that.$Message.success(resp.msg);
                  _getInviteCodeList(that);
                }else{
                  that.$Message.error(resp.msg);
                }
              that.modal.name = '';
              that.modal.kpi = '';
              that.modal.id = '';
            }
          })
       },
       cancel () {
         this.modal.name = '';
         this.modal.kpi = '';
         this.modal.id = '';
       }
    },
    watch: {
      '$route' (to, from) {
        this.pid = to.query.pid;
        this.downloadUrl = this.$BaseUrl+'/v2/cbgc/inviteCode/export?pid='+this.pid;
        _getInviteCodeList(this);
      }
    }
  }

  function _getInviteCodeList(context) {
    let pid = context.pid || 0;
    context.$.ajax({
      type:'get',
      url:context.$BaseUrl+'/v2/cbgc/inviteCode/list?pid='+pid,
      success(resp){
          if(resp.data.level > 1 && resp.data.inviteCode && resp.data.inviteCode.name){
             context.pageInfo.palceName = resp.data.inviteCode.name
          }else {
            context.pageInfo.palceName = '';
          }
          if(resp.data.level && resp.data.level > 1 && resp.data.subcodePrefix){
            context.invite.code = resp.data.subcodePrefix;
          }else {
            context.invite.code = '';
          }
          context.pageInfo.level = resp.data.level || 1;
          context.pageInfo.activeCode = resp.data.sum;
          context.pageInfo.total = resp.data.list.length;
          context.tableData = resp.data.list;
      }
    })
  }
</script>
