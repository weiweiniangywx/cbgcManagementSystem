<style scoped>

</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content">
      <Row>
        <Col span="12" style="padding:5px;width: 160px">
        <Input v-model="username" placeholder="请输入用户名" />
        </Col>
        <Col span="12" style="padding:5px;width: 160px">
        <Input v-model="searchIp" placeholder="请输入IP" />
        </Col>
        <Col span="12" style="padding:5px;width: 160px">
        <Input v-model="action" placeholder="请输入Action地址" />
        </Col>
        <Col span="12" style="padding:5px;width: 210px">
        <Date-picker type="daterange" confirm placement="bottom-end" placeholder="请选择操作时间范围" :value="datePic" @on-change="handleChange"></Date-picker>
        </Col>

        <Col span="12" style="padding:5px;width: 160px">
        <Select v-model="method" filterable  placeholder="请求方式">
          <Option  v-for="item in methodList" :value="item.value" :key="1">{{ item.label }}</Option>
        </Select>
        </Col>
        <Col span="12" style="padding:5px;width: 160px">
        <Select v-model="guesspass" filterable placeholder="是否猜密码">
          <Option  v-for="item in guesspassList" :value="item.value" :key="1">{{ item.label }}</Option>
        </Select>
        </Col>
        <Button style="margin: 5px" type="primary" shape="circle" icon="ios-search"  @click="searchLogList"></Button>

      </Row>

      <Table stripe border :columns="columns" :data="data2" style="margin-top: 20px"></Table>
      <div style="overflow: hidden">
        <Page :total="2000" show-elevator style="margin: 10px;float: right" @on-change="changePage"></Page>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  export default {
    data:function(){
      return{
        Logs:[],
        resourceIndex:1,
        type:'video',
        columns:columnsConfig,
        data1:[],
        data2:[],
        paths:['首页','系统安全' ,'系统日志'],
        username: '',
        loading1: false,
        options1: [],
        searchIp: '',
        action:'',
        loading2: false,
        options2: [],
        page:1,
        method: '',
        guesspass: 0,
        datePic:'',
        methodList:[
          {
            value: '',
            label: '请求方式'
          },
          {
            value: 'GET',
            label: 'GET'
          },
          {
            value: 'POST',
            label: 'POST'
          }
        ],
        guesspassList: [
          {
            value: 0,
            label: '是否猜密码'
          },
          {
            value: 1,
            label: '否'
          },
          {
            value: 2,
            label: '是'
          }]

      }
    },
    methods:{
      changePage(page){
        this.page = page;
        this.searchLogList();
      },
      handleChange (date) {
        this.datePic = date;
      },
      searchLogList(){
        var url='list?page='+this.page+'&username='+this.username+'&ip='+this.searchIp+'&action='+this.action+'&daterange='+this.datePic+'&method='+this.method+'&guesspass='+this.guesspass;
        getLogList(this,url);
      }
    },
    created:function () {
      var url="list?page=1";
      getLogList(this,url);

    },

    components:{
      bread:bread
    }
  }
  function getLogList(context,url){
    context.$Loading.start();
    context.$.ajax({
      url:context.$BaseUrl+'/v2/syslog/'+url,
      type:'get',
      success:function (data) {
        var data = data.data;
        context.data1 = data.logList;
        for(var i=0;i<data.logList.length;i++) {
          var timestamp4 = new Date(context.data1[i].optDate);
          var timestamp = timestamp4.toLocaleDateString().replace(/\//g, "-") + " " + timestamp4.toTimeString().substr(0, 8);
          context.data1[i].optDate = timestamp;
        }
        context.data2 = context.data1;
        context.$Loading.finish();
      }
    })
  }


  var columnsConfig = [
    {
      title:'ID',
      key:'id',
      align: 'center',
      width:'55'
    },
    {
      title:'IP地址',
      key:'ip',
      width:'120'
    },
    {
      title:'用户名',
      key:'username',
      width:'95'
    },
    {
      title:'密码',
      key:'password',
      width:'70'
    },
    {
      title:'动作',
      key:'action',
      width:'135'
    },
    {
      title:'方法',
      key:'method',
      width:'65'
    },
    {
      title:'时间',
      key:'optDate',
      width:'135'
    },
    {
      title:'浏览器标识',
      key:'userAgent',
      ellipsis:'true'
    },
    {
      title:'参数',
      key:'params',
      width:'135'
    }
  ];
</script>
