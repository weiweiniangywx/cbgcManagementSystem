<style >
  .mediaViewer{
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background: rgba(0,0,0,.6);
    transform: scale(0);
    transform-origin: center center;
    text-align: center;
    vertical-align: middle;
    transition: all ease-in-out 300ms;
  }
  .mediaViewer.show{
    transition: all ease-in-out 300ms;
    transform: scale(1);
  }
  .mediaViewer .viewCtrl{
    position: absolute;
    display: block;
    color: white;
    font-size: 50px;
    top: 45%;
    padding: 15px 30px;
    box-sizing: border-box;
  }
  .mediaViewer audio{
    margin-top: 20%;
  }
  .mediaViewer video{
    margin-top: 5%;
    height: 80%;
  }
  .mediaViewer .viewCtrl:active{
    color: #1e88e5;
  }
  .mediaViewer .viewCtrl.close{
    top: 50px;
    right: 150px;
  }
  .file-path-bg{
    border-left: 2px solid #3091f2;
    padding-left: 5px;
    margin: 5px 0;
    background-color: #dddddd;
    border-bottom-right-radius: 3px;
    border-top-right-radius: 3px;
  }
</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content">
      <div style="overflow: hidden">
        <Button type="primary" size="large" @click="exportData"><Icon type="ios-download-outline"></Icon> 导出本页数据</Button>
        <Page :total="50" style="margin-bottom: 10px;float: right" @on-change="changePage"></Page>
      </div>
      <Table ref="table" stripe border :columns="columns" :data="readers"></Table>
    </div>

    <div :class="{'show':isMediaShow}" class="mediaViewer">
      <video :src="readerWorkPath" v-if="type === 'video'" controls="controls"></video>
      <audio :src="readerWorkPath" controls="controls" v-else="type === 'audio'"></audio>
      <a @click.prevent="viewClose" class="viewCtrl close"><Icon type="close-round"></Icon></a>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  export default {
    data:function(){
      return{
        readers:[],
        readerWorkPath:'',
        resourceIndex:1,
        type:'video',
        isMediaShow:false,
        columns:columnsConfig,
        paths:['首页','报名活动','520表白四川']
      }
    },
    created:function(){
        getReaderList(this,1);
    },
    methods:{
      changePage(page){
          getReaderList(this,page);
      },
      showPreview(index){
          _showPreview(this,index);
      },
      viewClose(){
          this.isMediaShow = false;
      },
      exportData(){
        this.$refs.table.exportCsv({
          filename: '表白四川数据'
        });
      }
    },
    components:{
      bread:bread
    }
  }

  function getReaderList(context,page) {
    context.$Loading.start();
    context.$.ajax({
      url:context.$BaseUrl+'/enroll/user/list?p='+page,
      type:'get',
      success:function (resp) {
          let temp = [];
        if(resp.data.users){
          resp.data.users.map(function (item) {
            if(item.enrollItemId === 2){
                temp.push(item)
            }
          });
          context.readers = temp;
        }
        context.$Loading.finish();
      }
    })
  }

  function _showPreview(context,index) {
      context.readerWorkPath = context.readers[index].attachment;
      let temp = context.readerWorkPath.split('/');
      let extension = temp[temp.length-1].split('.')[1].toLowerCase();
      let type = '';
      if(extension === 'mp3'){
        type = 'audio'
      }else {
        type = 'video'
      }
      context.type = type;
      context.isMediaShow = true;
  }

  var columnsConfig = [
    {
      title:'告白',
      key:'intro'
    },
    {
      title:'上传文件地址',
      key:'attachment',
      render(row,col,index){
          let dom = '';
          if(row.attachment && row.attachment!==""){
              row.attachment.split(',').map(function (item) {
                  dom += '<p class="file-path-bg">'+item+'</p>';
              })
          }
          return dom;
      }
    },
    {
      title:'作者',
      key:'name',
      width:150
    },
    {
      title:'年龄',
      key:'age',
      width:100
    },
    {
      title:'职业',
      key:'company',
      width:200
    },
    {
      title:'联系方式',
      key:'phone',
      width:150
    },
  ]
</script>
