<style scoped>
  div.des{
    min-height: 150px;
  }
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content " style="padding: 10px">
      <Form :model="activity"  label-position="right" :label-width="100" >
        <Row>
          <Col span="8">
            <Form-item label="名称" >
              <Input v-model="activity.name"></Input>
            </Form-item>
            <Form-item label="初始抽奖次数">
              <Input v-model="activity.initCount"></Input>
              <span>活动开始时的抽奖次数</span>
            </Form-item>
            <Form-item label="每日更新次数" >
              <Input v-model="activity.dailyCount"></Input>
              <span>活动期间每日更新的次数</span>
            </Form-item>
            <Form-item label="拦截器" >
              <Input v-model="activity.raffleInterceptor"></Input>
              <span>请咨询技术</span>
            </Form-item>
            <Form-item label="开始时间" >
              <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择日期" v-model="activity.startDate"></Date-picker>
            </Form-item>
            <Form-item label="结束时间" >
              <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择日期" v-model="activity.endDate"></Date-picker>
            </Form-item>
            <Form-item label="焦点图">
              <Input v-model="activity.banner" style="margin-bottom: 10px"></Input>

              <cg-uploader
                ref="upload"
                ns="lottery"
                :onRemove="handleRemove"
                :onSuccess="handleSuccess"
                :maxLength="1">
              </cg-uploader>

              <span>选择上传</span>
           </Form-item>
            <Form-item label="背景">
                <Input v-model="activity.bg"></Input>
            </Form-item>
          </Col>
          </Row>
        <Row>
          <Col span="20">
            <Form-item label="活动描述">
              <div id="description" class="des"></div>
            </Form-item>
            <Form-item label="活动规则">
              <div id="rule" class="des"></div>
            </Form-item>
          </Col>
        </Row>
        <Form-item>
          <Button type="primary" @click="handleSubmit">提交</Button>
          <Button type="ghost" style="margin-left: 8px" @click="go_Back">取消</Button>
        </Form-item>
      </Form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  import cguploader from '../common/cg-uploader.vue'
  import 'wangeditor'
  export default {
    data:function(){
      return{
        routeParams:this.$route.query,
        paths:['首页','运营管理','抽奖','编辑活动'],
        activity:{},
        uploadList:[],
        defaultList:[]
      }
    },
    created:function(){
        if(this.routeParams.activityId){
            _getLotteryDetail(this);
        }
    },
    mounted(){
      //更改本页面的日期格式化方法
      //配置富文本编辑器
      if(window.$ == undefined){
        window.jQuery = window.$ = this.$;
      }
      _createEditor(this);
      //初始化内容
      this.uploadList = this.$refs.upload.fileList;
    },
    methods:{
      go_Back(){
          history.go(-1);
      },
      handleRemove (file) {
        this.activity.banner = '';
      },
      handleSuccess (resp, file ) {
         this.activity.banner = resp.url;
      },
      handleSubmit (){
        let that = this;
        //手动处理时间
        if(that.activity.startDate){
          that.activity.startDate = new Date(that.activity.startDate).toLocaleString_shim();
        }
        if(that.activity.endDate){
          that.activity.endDate = new Date(that.activity.endDate).toLocaleString_shim();
        }

        //手动处理富文本编辑
        that.activity.description  = that.$descriptionEditor.$txt.html();
        that.activity.rule = that.$ruleEditor.$txt.html();
        that.$.ajax({
          type:'post',
          url:that.$BaseUrl+'/v2/lottery/update',
          data:that.activity,
          success(resp){
            that.$Message.success(resp.msg);
            if(resp.code === 1){
              that.go_Back()
            }
          }
        })
      }
    },
    components:{
        bread:bread,
        'cg-uploader':cguploader
    }
  }

  function _getLotteryDetail(context) {
     context.$.ajax({
        type:'get',
        url:context.$BaseUrl+'/v2/lottery/detail',
        data:{
            id:context.routeParams.activityId
        },
        success(resp){
          context.activity = resp.data.lottery;
          context.$descriptionEditor.$txt.html(context.activity.description);
          context.$ruleEditor.$txt.html(context.activity.rule);
        }
     })
  }

  function _createEditor(context) {
    let description = document.getElementById('description');
    let rule = document.getElementById('rule');
    wangEditor.config.printLog = false;

    let descriptionEditor = new wangEditor(description);
    let ruleEditor = new wangEditor(rule);
    /*配置上传地址*/
    descriptionEditor.config.uploadImgUrl = context.$BaseUrl+'/upload/img4WangEditor';
    ruleEditor.config.uploadImgUrl = context.$BaseUrl+'/upload/img4WangEditor';

    /*配置cookie*/
    descriptionEditor.config.withCredentials = true;
    ruleEditor.config.withCredentials = true;

    /*配置文件key*/
    descriptionEditor.config.uploadImgFileName = 'file'
    ruleEditor.config.uploadImgFileName = 'file'

    /*配置上传参数*/
    descriptionEditor.config.uploadParams = {
      ns:'/lottery',
      ajax:true
    };
    ruleEditor.config.uploadParams = {
      ns:'/lottery',
      ajax:true
    };

    /*编辑器配置*/
    descriptionEditor.config.menus = $.map(wangEditor.config.menus, function(item, key) {
      /*去掉地图*/
      if (item === 'location') {
        return null;
      }
      return item;
    });
    ruleEditor.config.menus = $.map(wangEditor.config.menus, function(item, key) {
      /*去掉地图*/
      if (item === 'location') {
        return null;
      }
      return item;
    });

    descriptionEditor.create();
    ruleEditor.create();

    context.$descriptionEditor = descriptionEditor;
    context.$ruleEditor = ruleEditor;
  }
</script>
