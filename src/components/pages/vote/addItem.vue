<style scoped>
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
  div.des{
    min-height: 300px;
  }
</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content">
      <Row>
        <Col offset="1" :xs="23" :lg="20">
        <Form :model="voteItemAdd" :label-width="80">
          <Form-item label="选手信息">
            所属活动id：{{voteItemAdd.voteActivityId}}
            <div v-if="voteItemAdd.id">
            选手id：{{voteItemAdd.id}}
            </div>
          </Form-item>
        <Row>
          <Col span="11">
          <Form-item label="名称">
            <Input v-model="voteItemAdd.name" placeholder="参赛选手的名称或者参赛项目标题"></Input>
          </Form-item>
          <Form-item label="电话">
            <Input v-model="voteItemAdd.phone" placeholder="若无可忽略"></Input>
          </Form-item>
          </Col>
        </Row>

        <Form-item label="性别">
        <Radio-group v-model="voteItemAdd.sex">
          <Radio label="1">男</Radio>
          <Radio label="0">女</Radio>
        </Radio-group>
        </Form-item>

        <Row>
          <Col span="11">
          <Form-item label="虚拟票数">
            <Input  v-model="voteItemAdd.virtualVoteCount" placeholder="输入虚拟票数"></Input>
          </Form-item>
          <Form-item label="作者">
            <Input  v-model="voteItemAdd.author" placeholder="输入作者"></Input>
          </Form-item>
          </Col>
        </Row>

        <Form-item label="选手简介">
          <div id="intro" class="des"></div>
        </Form-item>

        <!--图片上传-->
        <Form-item label="上传图片">

          <cg-uploader
            ref="upload"
            :defaultList="defaultList"
            ns="voteItems">
          </cg-uploader>

        </Form-item>
        <Form-item>
          <Button type="primary" @click="handleSubmit">提交</Button>
          <Button type="ghost" style="margin-left: 8px" @click="go_Back">取消</Button>
        </Form-item>
        </Form>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue';
  import cguploader from '../common/cg-uploader.vue';
  export default {
    data:function(){
      return{
        msg:'投票页面',
        paths:['首页','运营管理','投票','添加选项'],
        voteItemAdd: {
          name: '',
          phone:'',
          status:1,
          sex: 1,
          virtualVoteCount: 0,
          voteActivityId:this.$route.query.voteActivityId,
          pics:'',
          intro:'',
          author:''
        },
        uploadList:[],
        defaultList:[]
      }
    },
    created:function(){
        let context = this;

        if(this.$route.params && this.$route.params.id){

          let temp = this.$route.params.pics;
          if(temp[0]!=""){
            context.defaultList = temp.map(function (item) {
              return {
                name:new Date().getTime()+Math.random()*100,
                url:item
              }
            })
          }
           getDetail(context,context.$route.params.id,function (resp) {
             let obj = {
               id:resp.data.vote.id,
               name:resp.data.vote.name,
               phone:resp.data.vote.phone,
               status:resp.data.vote.status,
               sex: resp.data.vote.sex ? 1 : 0,
               virtualVoteCount: resp.data.vote.virtualVoteCount,
               voteActivityId:resp.data.vote.voteActivityId,
               pics:resp.data.vote.pics,
               intro:resp.data.vote.intro,
               author:resp.data.vote.author
             };
             context.editor.$txt.html(resp.data.vote.intro);
             context.voteItemAdd = obj;
           });

        }
    },
    components:{
      bread:bread,
      'cg-uploader':cguploader
    },
    methods: {
      go_Back(){
          history.go(-1);
      },
      handleSubmit () {
        let that = this;
        this.voteItemAdd.pics = this.uploadList.map(function (item) {
            return item.url
        }).join(',');

        this.voteItemAdd.intro = this.editor.$txt.html();
        that.$Loading.start();
        this.$.ajax({
          type:'post',
          url:this.$BaseUrl+'/vote/item/save',
          data:this.voteItemAdd,
          success:function (resp) {
            that.$Message.success(resp.msg);
            if(that.voteItemAdd.id){
              that.$router.push({path:'voteItemList',query:{voteActivityId:that.voteItemAdd.voteActivityId}});
              return;
            }
            that.voteItemAdd.name = '';
            that.voteItemAdd.phone = '';
            that.voteItemAdd.virtualVoteCount = '';
            that.voteItemAdd.pics = '';
            that.voteItemAdd.intro = '';
            that.$refs.upload.fileList = [];
            that.uploadList = that.$refs.upload.fileList;
            that.$Loading.finish();
          }
        })
      }
    },
    mounted () {
      if(window.$ == undefined){
        window.jQuery = window.$ = this.$;
      }
      _createEditor(this);
      this.uploadList = this.$refs.upload.fileList;
    }
  }
  function getDetail(context,id,func) {
    let action = '/vote/item/detail?id='+id;
    context.$.ajax({
      type:'get',
      url:context.$BaseUrl+action,
      success(resp){
          func(resp);
      }
    })
  }
  function _createEditor(context) {
    let div = document.getElementById('intro');
    wangEditor.config.printLog = false;
    let editor = new wangEditor(div);
    /*配置上传地址*/
    editor.config.uploadImgUrl = context.$BaseUrl+'/upload/img4WangEditor';

    /*配置cookie*/
    editor.config.withCredentials = true;

    /*配置文件key*/
    editor.config.uploadImgFileName = 'file';

    /*配置上传参数*/
    editor.config.uploadParams = {
      ns:'/voteItemPics',
      ajax:true
    };

    /*编辑器配置*/
    editor.config.menus = $.map(wangEditor.config.menus, function(item, key) {
      /*去掉地图*/
      if (item === 'location') {
        return null;
      }
      return item;
    });

    editor.create();
    context.editor= editor;
  }
</script>
