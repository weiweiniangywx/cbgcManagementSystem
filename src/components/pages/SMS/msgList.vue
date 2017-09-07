<style scoped>
  .header{
    float: left;
    margin: 5px;
  }
  .boxContent{
    font-size: 15px;
    margin: 10px;
  }
  .boxContent span{
    color: darkgrey;
  }
</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content ">


      <Modal
        title="查看短信发送信息"
        okText= '确定'
        cancelText= ''
        v-model="showTelInfo"
        :styles="{top: '20px'}">
        <div class="boxContent">
          <span>id:</span>{{this.id}}<br />
          <span>messageId:</span>{{this.messageId}}<br />
          <span>内容:</span>{{this.content}}<br />
          <span>电话号码:</span>{{this.phone}}<br />
          <span>发送时间:</span>{{this.sendTime}}<br />
          <span>收到时间:</span>{{this.receiveTime}}<br />
          <span>是否发送:</span>{{this.status}}<br />
          <span>错误码:</span>{{this.errorCode}}<br />
          <span>错误提示:</span>{{this.errorMsg}}<br />
        </div>
      </Modal>

      <div style="overflow: hidden">
        <div class="header">
          <Row>
            <Col span="12" style="padding:5px;width: 160px">
            <Input v-model="tel" placeholder="请输入电话号码" />
            </Col>
            <Button style="margin: 5px" type="primary" shape="circle" icon="ios-search"  @click="searchMsgList"></Button>

          </Row>
        </div>
        <Page :total="100" show-elevator style="margin: 5px;float: right" @on-change="changePage" :page-size="20"></Page>
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
        paths:['首页','运营管理','发送短信','发送列表'],
        tableData:[],
        page:1,
        tel:'',
        id:'',
        messageId:'',
        content:'',
        phone:'',
        sendTime:'',
        receiveTime:'',
        status:'',
        errorCode:'',
        errorMsg:'',
        showTelInfo:false,
        tableColumns:[
          {
            title:'id',
            key:'id',
            width:100
          },
          {
            title:'messageId',
            key:'messageId',
            ellipsis:true
          },
          {
            title:'内容',
            key:'content',
            ellipsis:true
          },
          {
            title:'电话号码',
            key:'phone'
          },
          {
            title:'发送时间',
            key:'sendTime'
          },
          {
            title:'收到时间',
            key:'receiveTime'
          },
          {
            title:'是否发送',
            key:'status'
          },
          {
            title:'错误码',
            key:'errorCode'
          },
          {
            title:'错误提示',
            key:'errorMsg',
            ellipsis:true
          },
          {
            title:'操作',
            key:'',
            render:(h, params) => {
              return h('Button', {
                on: {
                  click: () => {
                    this.showDetail(params.index)
                  }
                }
              }, '查看详细')
            },
            align:'center'
          }
        ]
      }
    },
    methods:{
      changePage(page){
        this.page = page;
        this.searchMsgList();
      },
      searchMsgList(){
        var url=this.page+'&phone='+this.tel;
        getMsgList(this,url);
      },
      showDetail(index){
        this.id = this.tableData[index].id;
        this.messageId = this.tableData[index].messageId;
        this.content = this.tableData[index].content;
        this.phone = this.tableData[index].phone;
        this.sendTime = this.tableData[index].sendTime;
        this.receiveTime = this.tableData[index].receiveTime;
        this.status = this.tableData[index].status;
        this.errorCode = this.tableData[index].errorCode;
        this.errorMsg = this.tableData[index].errorMsg;
        this.showTelInfo = true;

      },
    },
    created:function () {
      var url="1";
      getMsgList(this,url);
    },
    components:{
      bread:bread
    }
  }
  function getMsgList(context,url) {
    context.$.ajax({
      type:'get',
      url:context.$BaseUrl+'/sms/list?p='+url,
      success(resp){
        context.tableData = resp.data.list.map(function (item) {
         if (item.receiveTime!=null && item.receiveTime!='' && item.receiveTime!='undefined') {
           item.receiveTime = new Date(item.receiveTime).toLocaleString()
          }
          if (item.sendTime!=null && item.sendTime!='' && item.sendTime!='undefined') {
            item.sendTime = new Date(item.sendTime).toLocaleString()
          }
          if (item.status==0) {
            item.status= '已发送';
          }
          else
            item.status= '未发送';
          return item;
        });
      }
    })
  }
</script>
