<style>
  img.report-table-img{
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
        <Button type="primary" @click="sort_score">票数排行</Button>
        <Button type="primary" @click="sort_id">编号排行</Button>
        <Page :total="50" style="margin-bottom: 10px;float: right" @on-change="changePage" ></Page>
      </div>
      <Table size="small" stripe border :columns="itemTable" :data="items"></Table>
    </div>

    <div :class="{'show':isViewShow}" class="imgViewer">
      <a @click.prevent="viewPrev" class="viewCtrl left"><Icon type="chevron-left"></Icon></Icon></a>
      <img :src="viewPics[viewImgIndex]" >
      <a @click.prevent="viewNext" class="viewCtrl right"><Icon type="chevron-right"></Icon></a>
      <a @click.prevent="viewClose" class="viewCtrl close"><Icon type="close-round"></Icon></a>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  export default {
    data:function(){
      return{
        items:[],
        itemTable:[
          {
            title:'编号',
            key:'id',
            width:100
          },
          {
            title:'名称',
            key:'name'
          },
          {
            title:'图片',
            key:'pics',
            width:300,
            render: (h,params) =>{
                if(params.row.pics!=null && params.row.pics!='' && params.row.pics!='undefined'){
                  let  imgs =  params.row.pics;
                  let  _that = this;
                  return h('div',imgs.map(function (item,index) {
                      return h('img',{
                          'class':{
                            'report-table-img':true
                          },
                          attrs:{
                              src:item,
                          },
                          on:{
                              click:() =>{
                                _that.view(params.index,index)
                              }
                          }
                      })
                  }))
                }else {
                    return '';
                }
            }
          },
          {
            title:'最终票数',
            key:'score',
            width:150
          },
          {
            title:'操作',
            width:150,
            render: (h,params) => {
                return h('div',{
                    style:{
                        'text-align':'center'
                    }
                },[
                    h('Poptip',{
                      props:{
                        'confirm':true,
                        'title':'确认删除？'
                      },
                      style:{
                        'margin-right':'5px'
                      },
                      on:{
                          'on-ok':() =>{
                              this.deleteItem(params.row.id,params.index)
                          }
                      }
                    },[
                        h('Button',{
                            props:{
                               type:'warning',
                               size:'small'
                            }
                        },'删除')
                    ]),
                    h('Button',{
                        props:{
                            type:'info',
                            size:'small'
                        },
                        on:{
                            click:() => {
                                this.addItem(params.row)
                            }
                        }
                    },'修改')
                ])
            }
          }
        ],
        visible: false,
        imgSrc:'',
        viewPics:[],
        viewImgIndex:0,
        isViewShow:false,
        paths:['首页','投票管理','选手列表']
      }
    },
    created:function(){
        if(this.$route.query && this.$route.query.voteActivityId){
          getList(this,this.$route.query.voteActivityId,1)
        }
    },
    components:{
      bread:bread
    },
    methods:{
      changePage(page){
        if(this.$route.query && this.$route.query.voteActivityId){
          getList(this,this.$route.query.voteActivityId,page);
        }
      },
      handleView (img) {
        this.imgSrc = img;
        this.visible = true;
      },
      addItem(row){
         this.$router.push({name:'addItem',params:row});
      },
      deleteItem(id,index){
        let that = this;
        this.$.ajax({
          type:'get',
          url:this.$BaseUrl+'/vote/item/delete',
          data:{
            id:id
          },
          success:function (resp) {
            that.$Message.success(resp.msg);
            that.items.splice(index,1);
          }
        })
      },
      view(outerIndex,innerIndex){
        let pics = this.items[outerIndex].pics;
        if (pics!=null && pics!='' && pics!='undefined'){
          this.viewPics = this.items[outerIndex].pics;
          this.viewImgIndex = innerIndex;
          this.isViewShow = true;
          document.body.style.overflow = 'hidden'
        }
      },
      viewPrev(){
        let maxIndex = this.viewPics.length-1;
        if(this.viewImgIndex == 0){
          this.viewImgIndex = maxIndex
        }else {
          this.viewImgIndex--;
        }
      },
      viewNext(){
        let maxIndex = this.viewPics.length-1;
        if(this.viewImgIndex == maxIndex){
          this.viewImgIndex = 0
        } else {
          this.viewImgIndex++;
        }
      },
      viewClose(){
        this.isViewShow = false;
        document.body.style.overflow = 'auto'
      },
      sort_score(){
        let that = this;
        that.$Loading.start();
        that.$.ajax({
          type:'get',
          url:that.$BaseUrl+'/vote/item/top?id='+this.$route.query.voteActivityId,
          success(resp){
            that.$Loading.finish();
            that.items = resp.data.vote.map(function (item) {
              item.sex  = item.sex ? 1 : 0;
              item.pics = item.pics.split(',');
              return item;
            });
          }
        })
      },
      sort_id(){
          getList(this,this.$route.query.voteActivityId,1);
      }
    }
  }
  function getList(context,id,page) {
    context.$Loading.start();
    context.$.ajax({
      type:'get',
      url:context.$BaseUrl+'/vote/item/list?id='+id+'&p='+page,
      success(resp){
        context.$Loading.finish();
        context.items = resp.data.vote.map(function (item) {
          item.sex  = item.sex ? 1 : 0;
          item.pics = item.pics.split(',');
          return item;
        });
      }
    })
  }
</script>
