<style scoped>
  .layout-content{
    padding-top: 5px;
  }
</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content">
      <div style="padding-left: 10px">
        <h3>报料名称：{{reportInfo.content}}</h3>
        <Form :model="newsInfo" label-position="top"  style="margin-top: 15px">
          <Form-item label="新闻标题"  style="width: 600px">
            <Input v-model="newsInfo.title" placeholder="请输入"></Input>
          </Form-item>
          <!--选择<input type="file" id="upload"> <button id="uploadBtn">上传</button>-->
          <Form-item id="editorContent" style="min-height: 550px"></Form-item>
          <Form-item style="margin-top: 20px">
            <Button type="primary" @click="handleSubmit" size="large">提交</Button>
            <Button type="ghost" @click="handleReset" size="large">重置</Button>
          </Form-item>
        </Form>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  import 'wangeditor'
  export default {
    data:function(){
      return{
        reportInfo:this.$route.params,
        newsInfo:{
            title:''
        },
        paths:['民情热线','添加新闻']
      }
    },
    created:function(){

    },
    mounted:function () {
      if(window.$ == undefined){
        window.jQuery = window.$ = this.$;
      }
      _createEditor(this);
    },
    components:{
      bread:bread
    },
    methods:{
      handleSubmit(){
        _handleSubmit(this);
      },
      handleReset(){
        this.newsInfo.title = '';
        this.editor.$txt.html('')
      }
    }
  }
  /**
   * 创建富文本编辑器
   *
   * */
  function _createEditor(context) {
    let div = document.getElementById('editorContent');
    wangEditor.config.printLog = false;
    let editor = new wangEditor(div);
    /*配置上传地址*/
    editor.config.uploadImgUrl = context.$BaseUrl+'/upload/img4WangEditor';

    /*配置cookie*/
    editor.config.withCredentials = true;

    /*配置文件key*/
    editor.config.uploadImgFileName = 'file'

    /*配置上传参数*/
    editor.config.uploadParams = {
      ns:'/mqrxnews',
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


  /**
   * 提交数据
   * */
  function _handleSubmit(context){
    let data={
      reportId:context.reportInfo.id,
      title:context.newsInfo.title,
      content:context.editor.$txt.html(),
      uid:1,
      publishDate:new Date(),
    };

    if(data.title == ''){
      context.$Message.warning('新闻标题不能为空')
      return false
    }

    if(data.content == ''){
      context.$Message.warning('新闻内容不能为空')
      return false
    }

    context.$Loading.start();
    context.$.ajax({
      url:context.$BaseUrl+'/mqrx/news/add',
      type:'post',
      contentType:'application/x-www-form-urlencoded',
      xhrFields: {
        withCredentials: true
      },
      data:data,
      success:function (resp) {
        context.$Message.success(resp.msg);
        context.$Loading.finish();
        context.$router.push('/newsList')
      },
      error:function (error) {
        context.$Loading.error()
      }
    })
  }
</script>
