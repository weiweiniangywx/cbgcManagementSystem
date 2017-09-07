<style scoped>

</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content">
      <Form :model="enroll" label-position="right" :label-width="200" >
        <Row>
          <Col span="8">
          <Form-item label="名称">
            <Input v-model="enroll.title"></Input>
          </Form-item>
          <Form-item label="开始时间">
            <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择日期" v-model="enroll.startDate"></Date-picker>
          </Form-item>
          <Form-item label="结束时间">
            <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择日期" v-model="enroll.endDate"></Date-picker>
          </Form-item>

          </Col>
        </Row>
        <Form-item label="状态">
          <Radio-group v-model="enroll.status">
            <Radio label=0>启用</Radio>
            <Radio label=1>禁用</Radio>
          </Radio-group>
        </Form-item>
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
  export default {
    data:function(){
      return {
        paths:['首页','运营管理','活动管理','网上报名'],
        enrollActivityId:'',
        enroll:{
          title: '',
          startDate: '',
          endDate: '',
          status:0
        },
      }
    },
    created:function(){
      if(this.$route.query && this.$route.query.enrollActivityId){
        let that = this;
        that.$.ajax({
          type:'get',
          url:that.$BaseUrl+'/enroll/detail',
          data:{id:this.$route.query.enrollActivityId},
          success(resp){
            that.enroll = resp.data.activity;
          }
        })
      }
    },
    components:{
      bread:bread
    },
    methods: {

      go_Back(){
        history.go(-1);
      },
      handleSubmit (){
        let that = this;
        //手动处理时间
        that.enroll.startDate = new Date(that.enroll.startDate).toLocaleString_shim();
        that.enroll.endDate = new Date(that.enroll.endDate).toLocaleString_shim();
        console.log(that.enroll.status);
        that.$.ajax({
          type:'post',
          url:that.$BaseUrl+'/enroll/save',
          data:that.enroll,
          success(resp){
            that.$Message.success(resp.msg);

            if(resp.code === 1){
              that.go_Back()
            }
          }
        })
      }
    },
    mounted () {
      if(window.$ == undefined){
        window.jQuery = window.$ = this.$;
      }
    }
  }

</script>
