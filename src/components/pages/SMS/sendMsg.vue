<style scoped>

</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content" >
      <div style="float: right;width: 20%">
        <Button  style="float: left;margin-left: -180%" type="primary" @click="handleSubmit">发送</Button>
      </div>
      <Form :model="send" label-position="right" :label-width="100" style="width: 80%">

          <Form-item label="短信code" style="width: 50%">
            <Input v-model="send.templateCode" placeholder="请输入短信发送code"></Input>
          </Form-item>
          <Form-item label="内容">请参考Excel示（<a href="http://img0.chuanbaoguancha.cn/download/sms-content-example.xls">下载示例</a>）例制作Excel表格，并将表格复制转换为json格式（<a href="http://www.bejson.com/json/col2json/" target="_blank">点此进入转换页面</a>）的文本粘贴至此。（注：Excel必须包含phone这一列，其它列为短信模板中的值）<br />
            <Input v-model="send.str" type="textarea" :autosize="{minRows:15}" placeholder="请输入符合规范的内容"></Input>
          </Form-item>
      </Form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  export default {
    data:function(){
      return {
        paths:['首页','运营管理','发送短信','发送列表'],
        send:{
          templateCode: '',
          str: ''
        },
      }
    },
    components:{
      bread:bread
    },
    methods: {
      handleSubmit (){
        let that = this;
        that.$.ajax({
          type:'post',
          url:that.$BaseUrl+'/sms/send',
          data:that.send,
          success(resp){
            that.$Message.success(resp.msg);
          }
        })
      }
    }
  }

</script>
