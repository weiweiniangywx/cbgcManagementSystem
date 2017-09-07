<style scoped>
  .demo-upload-list img{
    width: 100%;
    height: 100%;
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
      <Row>
        <Col offset="1" :xs="23" :lg="20">
        <Form :model="collectionAdd" :label-width="80">
          <Form-item label="收藏信息">
            <div v-if="collectionAdd.id">
              收藏id：{{collectionAdd.id}}
            </div>
          </Form-item>
          <Row>
            <Col span="11">
            <Form-item label="标题">
              <Input v-model="collectionAdd.title" placeholder="请输入标题"></Input>
            </Form-item>
            <Form-item label="网址">
              <Input v-model="collectionAdd.url" placeholder="请输入网址"></Input>
            </Form-item>
            <Form-item label="描述">
              <Input v-model="collectionAdd.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入内容"></Input>
            </Form-item>
            </Col>
          </Row>

          <Form-item label="公开或私有">
            <Radio-group v-model="collectionAdd.type">
              <Radio label="1">完全公开</Radio>
              <Radio label="2">内部公开</Radio>
              <Radio label="0">私有</Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="分类">
            <Radio-group v-model="collectionAdd.catId">

              <Radio v-for="(item, index) in catIdList" :label="item.catId" :key="index+1">{{item.name}}</Radio>
            </Radio-group>
          </Form-item>


          <!--图片上传-->
          <Form-item label="上传图片">
            <cg-uploader
              ref="upload"
              ns="collection"
              :maxLength="1"
              :defaultList="defaultList">
            </cg-uploader>
          </Form-item>
          <Form-item>
            <Button type="primary" @click="handleSubmit">提交</Button>
            <Button type="ghost" style="margin-left: 8px">取消</Button>
          </Form-item>
        </Form>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  import cguploader from '../common/cg-uploader.vue'
  export default {
    data:function(){
      return{
        msg:'投票页面',
        paths:['首页','内容管理' ,'收藏管理','收藏列表','增加收藏'],
        collectionAdd: {
          title: '',
          url:'',
          status:0,
          type: 0,
          collectionId:this.$route.query.collectionId,
          pics:'',
          description:'',
          catId:1,
          thumb:[]
        },
        uploadList: [],
        defaultList:[],
        catIdList:this.$collectionType.slice(1)
      }
    },
    created:function(){
      if(this.$route.params && this.$route.params.id){
        let obj = {
          id:this.$route.params.id,
          title:this.$route.params.title,
          url:this.$route.params.url,
          status:this.$route.params.status,
          type: this.$route.params.type,
          catId:this.$route.params.catId,
          collectionId:this.$route.params.collectionId,
          pics:this.$route.params.thumb.join(','),
          description:this.$route.params.description

        };
        let temp = this.$route.params.thumb;
        if(temp[0]!=""){
          this.defaultList = temp.map(function (item) {
            return {
              name: new Date()+Math.random()*10,
              url:item
            }
          });
        }
        this.collectionAdd = obj;
      }
    },
    components:{
      bread:bread,
      'cg-uploader':cguploader
    },
    methods: {
      handleSubmit (){
        let that = this;
        this.collectionAdd.pics = this.uploadList.map(function (item) {
          return item.url
        }).join(',');
        that.$Loading.start();
        this.$.ajax({
          type:'post',
          url:this.$BaseUrl+'/cms/collection/save',
          data:{
            id:this.collectionAdd.id,
            title:this.collectionAdd.title,
            description:this.collectionAdd.description,
            url:this.collectionAdd.url,
            thumb:this.collectionAdd.pics,
            status:this.collectionAdd.status,
            type:this.collectionAdd.type,
            catId:this.collectionAdd.catId
          },
          success:function (resp) {
            that.$Message.success(resp.msg);
            if(that.collectionAdd.id){
              that.$router.push({path:'list',query:{collectionId:that.collectionAdd.collectionId}});
              return;
            }
            that.collectionAdd.title = '';
            that.collectionAdd.url = '';
            that.collectionAdd.description = '';
            that.collectionAdd.pics = '';
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
      this.uploadList = this.$refs.upload.fileList;
    }
  }


</script>
