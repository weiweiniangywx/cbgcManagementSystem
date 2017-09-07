<style scoped>
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

</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content">
      <div style="overflow: hidden">
        <Page :total="50" style="margin-bottom: 10px;float: right" @on-change="changePage"></Page>
      </div>
      <Table stripe border :columns="columns" :data="readers"></Table>
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
        paths:['首页','朗读者活动']
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
      success:function (data) {
        context.readers = data.data.users;
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
      title:'作品名称',
      key:'topic'
    },
    {
      title:'作品简介',
      key:'intro'
    },
    {
      title:'查看作品',
      key:'attachment',
      align: 'center',
      render(row,col,index){
          return `<i-button type="info" @click="showPreview(${index})">预览作品</i-button>
          <a :href="row.attachment" download="download">下载文件</a>`
      }
    },
    {
      title:'作者',
      key:'name'
    },
    {
      title:'联系方式',
      key:'phone'
    },
  ]
</script>
