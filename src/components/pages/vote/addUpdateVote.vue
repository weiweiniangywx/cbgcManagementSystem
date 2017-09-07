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
    <div class="layout-content">
      <Form ref='vote' :model="vote" :rules="voteRule" label-position="right" :label-width="200" >
        <Row>
          <Col span="8">
          <Form-item label="名称" prop="title">
            <Input v-model="vote.title"></Input>
          </Form-item>
          <Form-item label="开始时间" prop="startDate">
            <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择日期" v-model="vote.startDate"></Date-picker>
          </Form-item>
          <Form-item label="结束时间" prop="endDate">
            <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择日期" v-model="vote.endDate"></Date-picker>
          </Form-item>

          <Form-item label="每日总票数">
            <Input-number   v-model="vote.dailyAllCount"></Input-number>
          </Form-item>
          <Form-item label="每日对单个选手的投票数">
            <Input-number   v-model="vote.dailyPerCount"></Input-number>
          </Form-item>
          <Form-item label="单个选手每日可得票数">
            <Input-number  v-model="vote.dailyItemCount"></Input-number>
            <br><span>0为不限制</span>
          </Form-item>
          <Form-item label="拦截器" >
            <Input v-model="vote.interceptor"></Input>
            <span>请咨询技术</span>
          </Form-item>

          </Col>
        </Row>
        <Row>
          <Col span="20">
          <Form-item label="活动简介">
            <div id="description" class="des"></div>
          </Form-item>
          <Form-item label="活动规则">
            <div id="rule" class="des"></div>
          </Form-item>
          </Col>
        </Row>
        <Row v-show="showCtrl.show">
          <Col span="8">
            <Form-item label="焦点图">
            <Input v-model="vote.banner" style="margin-bottom: 10px"></Input>

            <cg-uploader
              ref="uploadBanner"
              ns="voteBanner"
              :onSuccess="handleSuccessBanner"
              :onRemove="handleRemoveBanner"
              :maxLength="1">
            </cg-uploader>
            <br><span>选择上传</span>
          </Form-item>
            <Form-item label="微信分享标题">
              <Input v-model="vote.shareTitle"></Input>
            </Form-item>
            <Form-item label="微信分享描述">
              <Input v-model="vote.shareDesc"></Input>
            </Form-item>
            <Form-item label="微信分享缩略图">
            <Input v-model="vote.shareIcon" style="margin-bottom: 10px"></Input>
            <cg-uploader
              ref="uploadWxshareIcon"
              ns="voteShare"
              :onSuccess="handleSuccessWxshare"
              :onRemove="handleRemoveWxshare"
              :maxLength="1">
            </cg-uploader>
            <br><span>选择上传</span>
          </Form-item>
          </Col>
        </Row>
        <Form-item >
          <Button @click="showMore">{{showCtrl.desc}}</Button>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="handleSubmit('vote')">提交</Button>
          <Button type="ghost" style="margin-left: 8px" @click="go_Back">取消</Button>
        </Form-item>
      </Form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  import cguploader from '../common/cg-uploader.vue'
  export default {
    data:function(){
      return {
        paths:['首页','运营管理','投票','编辑投票'],
        voteActivityId:'',
        vote:{
          title: "",
          startDate: '',
          endDate: '',
          banner: null,
          shareTitle: null,
          shareIcon: null,
          shareUrl: null,
          shareDesc: null,
          dailyAllCount: 0,
          dailyPerCount: 0,
          dailyItemCount: 0,
          guideTips: null,
          intro: "",
          rule: "",
          interceptor:''
        },
        voteRule:{
          title: [
            { required: true, message: '活动名不能为空', trigger: 'blur' }
          ],
          startDate:[
            { required: true, type: 'date',message: '开始时间不能为空', trigger: 'change' }
          ],
          endDate:[
            { required: true,type: 'date', message: '结束时间不能为空', trigger: 'change'}
          ]
        },
        uploadListBanner:[],
        uploadListWxShareIcon:[],
        showCtrl:{
            desc: '展开更多',
            show: false
        }
      }
    },
    created:function(){
       //编辑活动
       _setData(this);
    },
    components:{
      bread:bread,
      'cg-uploader':cguploader
    },
    methods: {
      showMore(){
        if(this.showCtrl.show === false){
          this.showCtrl.show = true;
          this.showCtrl.desc = '点击收起'
        }  else {
          this.showCtrl.show = false;
          this.showCtrl.desc = '展开更多'
        }
      },
      go_Back(){
        history.go(-1);
      },
      handleRemoveBanner (file) {
        this.vote.banner = '';
      },
      handleRemoveWxshare (file) {
        this.vote.shareIcon = '';
      },
      handleSuccessBanner (resp, file ) {
        this.vote.banner = resp.url;
      },
      handleSuccessWxshare (resp, file ) {
        this.vote.shareIcon = resp.url;
      },
      handleSubmit (name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            let that = this;
            //手动处理时间
            that.vote.startDate = new Date(that.vote.startDate).toLocaleString_shim();
            that.vote.endDate = new Date(that.vote.endDate).toLocaleString_shim();
            //手动处理富文本编辑
            that.vote.intro  = that.$descriptionEditor.$txt.html();
            that.vote.rule = that.$ruleEditor.$txt.html();

            that.$.ajax({
              type:'post',
              url:that.$BaseUrl+'/vote/save',
              data:that.vote,
              success(resp){
                  if(resp.code > 0){
                    that.$Message.success(resp.msg);
                    if(resp.code === 1){
                      that.go_Back()
                    }
                  }else if(resp.code < 0){
                    that.$Message.error(resp.msg);
                  }
              }
            })
          }
        });
      }
    },
    watch: {
      '$route' (to, from) {
         _setData(this);
      }
    },
    mounted () {
      if(window.$ == undefined){
        window.jQuery = window.$ = this.$;
      }
      _createEditor(this);
      this.uploadListBanner = this.$refs.uploadBanner.fileList;
      this.uploadListWxShareIcon = this.$refs.uploadWxshareIcon.fileList;
    }
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
      ns:'/vote',
      ajax:true
    };
    ruleEditor.config.uploadParams = {
      ns:'/vote',
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

  function _setData(context) {
    if(context.$route.query && context.$route.query.voteActivityId){
      context.$Loading.start();
      context.$.ajax({
        type:'get',
        url:context.$BaseUrl+'/vote/detail',
        data:{id:context.$route.query.voteActivityId},
        success(resp){
          context.$Loading.finish();
          context.vote = resp.data.vote;
          context.vote.startDate = new Date(resp.data.vote.startDate);
          context.vote.endDate = new Date(resp.data.vote.endDate);
          context.$descriptionEditor.$txt.html(context.vote.intro);
          context.$ruleEditor.$txt.html(context.vote.rule);
        }
      })
    }
  }
</script>
