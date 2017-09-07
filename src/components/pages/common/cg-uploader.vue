<template>
  <div>
    <div class="demo-upload-list" v-for="item in uploadList">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
      ref="upload"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      :max-size="maxSize"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      multiple
      type="drag"
      :data="ajaxConfirmData"
      :action="action"
      style="display: inline-block;width:58px;">
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="查看图片" v-model="visible">
      <img :src="imgSrc" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
  export default {
    name:'cg-uploader',
    data () {
      return {
        imgSrc: '',
        visible: false,
        uploadList: [],
        fileList:[]
      }
    },
    props: {
        action:{
            type:String,
            default:'https://mossapi.chuanbaoguancha.cn/upload/img'
        },
        ns:{
          type: String,
          required: true
        },
        defaultList:{
          type: Array,
          default() {
            return [];
          }
        },
        onSuccess:{
          type: Function,
          default () {
            return {};
          }
        },
        onRemove:{
          type: Function,
          default () {
            return {};
          }
        },
        maxSize:{
            type:Number,
            default: 2048
        },
        maxLength:{
            type:Number,
            default: 5
        }
    },
    computed:{
      ajaxConfirmData(){
          return {
              ns:this.ns,
              ajax:true
          }
      },
      defaultAction(){
          return this.$imgUploadUrl;
      }
    },
    methods: {
      handleView (url) {
        this.imgSrc = url;
        this.visible = true;
      },
      handleRemove (file) {
        // 从 upload 实例删除数据
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        this.onRemove(file);
      },
      handleSuccess (res, file) {
        // 因为上传过程为实例，这里模拟添加 url
        file.url = res.url;
        this.onSuccess(res,file);
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        });
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
        });
      },
      handleBeforeUpload () {
        const check = this.uploadList.length < this.maxLength;
        if (!check) {
          this.$Notice.warning({
            title: `最多只能上传${this.maxLength}张图片。`
          });
        }
        return check;
      }
    },
    mounted () {
      this.fileList = this.$refs.upload.fileList;
      this.uploadList = this.$refs.upload.fileList;
      /*if(this.$imgUploadUrl){
          this.action = this.defaultAction;
      }*/
    }
  }
</script>
<style>
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
    right: 0;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
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
