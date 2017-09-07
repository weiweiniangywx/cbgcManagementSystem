<style>
  .ivu-table td.status-type{
    text-align: center;
  }
  .report-imgs{
    max-width: 100%;
    display: block;
    margin-top: 10px;
  }
  .report-table-img{
    height: 50px;
    width: 50px;
    cursor: pointer;
    margin: 5px;
  }
  .imgViewer{
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
  .imgViewer > img{
    margin-top: 5%;
    height: 80%;
    user-select: none;
  }
  .imgViewer.show{
    transition: all ease-in-out 300ms;
    transform: scale(1);
  }
  .imgViewer .viewCtrl{
    position: absolute;
    display: block;
    color: white;
    font-size: 50px;
    top: 45%;
    padding: 15px 30px;
    box-sizing: border-box;
  }
  .imgViewer .viewCtrl:active{
    color: #1e88e5;
  }
  .imgViewer .viewCtrl.left{
    left: 150px;
  }
  .imgViewer .viewCtrl.right{
    right: 150px;
  }
  .imgViewer .viewCtrl.close{
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
      <Table style="" size="small" stripe border :columns="columns" :data="reports" height="740"></Table>
    </div>

    <!--查看爆料-->
    <Modal
      v-model="modifyModal"
      title="查看报料"
      width="1200"
      :styles="{top: '50px','margin-bottom':'100px'}"
      >
      <input type="hidden" id="index">
      <div style="min-width: 600px;overflow-y:auto;font-size: 24px">
        {{reportDetails}}
        <img v-if="reportPics.length!=0" v-for="(item,index) in reportPics" :src="item" alt="" class="report-imgs">
      </div>
      <div slot="footer">
        <Button  type="primary" @click="modifyModal = false">确定</Button>
      </div>
    </Modal>

    <div :class="{'show':isViewShow}" class="imgViewer">
      <a @click.prevent="viewPrev" class="viewCtrl left"><Icon type="chevron-left"></Icon></Icon></a>
      <img :src="reportPics[viewImgIndex]" >
      <a @click.prevent="viewNext" class="viewCtrl right"><Icon type="chevron-right"></Icon></a>
      <a @click.prevent="viewClose" class="viewCtrl close"><Icon type="close-round"></Icon></a>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  import $ from 'jquery'
  import ed from 'wangeditor'
  export default {
    data:function(){
      return{
        /*是否显示修改模态框*/
        modifyModal:false,

        /*单个报料详情暂存变量*/
        reportDetails:'',

        /*单个报料图片暂存变量*/
        reportPics:[],

        /*所有报料数据，created、refresh、changePage时拉取更新*/
        reports:[],

        /*预览图片的定位变量*/
        viewImgIndex:0,

        /*预览框的显示控制*/
        isViewShow:false,

        /*表格定义*/
        columns:columnsConfig,

        /*表格高度*/
        tableHeight:document.body.clientHeight-60 - (24) - (15+10)*2 - 42 - 16,

        /*面包屑导航定义*/
        paths:['民情热线','报料列表']
      }
    },
    created:function(){
      getReport(this,1);
    },
    components:{
      bread:bread
    },
    methods:{
      showModal(index){
          this.reportDetails = this.reports[index].content;
          if(this.reports[index].pics.length !=0){
            this.reportPics = this.reports[index].pics.split(',');
          }
          this.modifyModal = true
      },
      modifyStatus(index){
        _modifyStatus(this,index)
      },
      addNews(row){
        _addNews(this,row);
      },
      changePage(page){
        getReport(this,page)
      },
      view(outerIndex,innerIndex){
          let pics = this.reports[outerIndex].pics;
        if (pics!=null && pics!='' && pics!='undefined'){
          this.reportPics = this.reports[outerIndex].pics.split(',');
          this.viewImgIndex = innerIndex;
          this.isViewShow = true;
          document.body.style.overflow = 'hidden'
        }
      },
      viewPrev(){
          let maxIndex = this.reportPics.length-1;
          if(this.viewImgIndex == 0){
              this.viewImgIndex = maxIndex
          }else {
              this.viewImgIndex--;
          }
      },
      viewNext(){
        let maxIndex = this.reportPics.length-1;
        if(this.viewImgIndex == maxIndex){
          this.viewImgIndex = 0
        } else {
          this.viewImgIndex++;
        }
      },
      viewClose(){
          this.isViewShow = false;
          document.body.style.overflow = 'auto'
      }
    },
    mounted(){
    }
  }
  /*表格配置*/
  var columnsConfig = [
    {
      title:'ID',
      key:'id',
      width:80
    },
    {
      title:'内容',
      key:'content',
      width:392
    },
    {
      title:'图片',
      key:'pics',
      width:340,
      render(row,col,index){
         if (row.pics!=null && row.pics!='' && row.pics!='undefined'){
          let  imgs =  row.pics.split(',')
          let dom = ``
          for (let i=0;i<imgs.length;i++){
            dom += `<img src="`+imgs[i]+`" class="report-table-img" alt="`+i+`" @click="view(${index},`+i+`)">`
          }
          return dom
        }else {
          return ''
        }
      }
    },
    {
      title:'城市',
      key:'city',
      width:100
    },
    {
      title:'爆料时间',
      key:'gmtCreate',
      width:150,
      render (row, column, index) {
        return new Date(row.gmtCreate).toLocaleDateString();
      }
    },
    {
      title:'爆料者姓名',
      key:'name',
      width:150
    },
    {
      title:'性别',
      key:'sex',
      width:70,
      render(row,col,index){
          let sex = ''
          if(row.sex == false){
              sex = '男'
          }else {
              sex = '女'
          }
          return sex;
      }
    },
    {
      title:'联系方式',
      key:'phone',
      width:150
    },
    {
      title:'处理状态',
      key:'status',
      className: 'status-type',
      width:100,
      render(row, column, index){
        if(row.status == '1'){
          return `<Poptip confirm title="确认取消？"  @on-ok="modifyStatus(${index})" >
                       <i-button type="success" size="small" >已处理</i-button>
                       </Poptip>`
        }else {
          return `<Poptip confirm title="确认处理？"  @on-ok="modifyStatus(${index})">
                       <i-button type="warning" size="small">未处理</i-button>
                       </Poptip>`
        }
      }
    },
    {
      title:'操作',
      key: 'action',
      align: 'center',
      width:100,
      render (row, column, index) {
        return `<i-button type="info" :disabled="row.status == 1" size="small" @click="addNews(row)">添加新闻</i-button>`;
      }
    },
  ];

  /**
   * 拉取数据
   * */
  function getReport(context,page) {
    context.$Loading.start()
    context.$.ajax({
      url:context.$BaseUrl+'/mqrx/report/list?p='+page,
      type:'get',
      success:function (data) {
        context.reports = data.data.reports;
        context.$Loading.finish();
      }
    })
  }

  /**
   * 跳转添加新闻页面
   * */
  function _addNews(context,obj){
      context.$router.push({name:'addNews',params:obj});
  }

  /**
   * 修改状态
   * */
  function _modifyStatus(context,index) {
    let nowStatus = context.reports[index].status;
    let toStatus = 0;

    if(nowStatus == 0){
      toStatus = 1
    }else if(nowStatus == 1){
      toStatus = 0
    }
    let data = {
      id:context.reports[index].id,
      status:toStatus
    };

    context.$.ajax({
      url:context.$BaseUrl+'/mqrx/report/changeStatus',
      type:'post',
      xhrFields: {
        withCredentials: true
      },
      data:data,
      success:function (resp) {
        context.reports[index].status = toStatus;
        context.$Message.success(resp.msg);
        context.$Loading.finish();
      },
      error:function (error) {
        context.$Loading.error(error.msg)
      }
    })
  }
</script>
