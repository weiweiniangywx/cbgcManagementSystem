<style scoped>
  .boxContent{
    text-align: center;
  }
  img.report-table-img{
    height: 50px;
    width: 50px;
    cursor: pointer;
    margin: 5px;
  }
</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content">
      <span style="padding-left: 15px">收藏列表</span>
      <i-Button type="primary" @click="addUrl()" style="margin: 10px">新增收藏</i-Button>
      <span style="padding-left: 15px">分类:</span>
      <i-Button style="margin-left: 5px" @click="searchList(item.catId)" v-for="(item, index) in $collectionType" :key="index+1">{{item.name}}</i-Button>

      <Table stripe border :columns="columns" :data="collectionList" style="margin-top: 20px"></Table>

      <Modal
        title="删除角色"
        ok-text="确定"
        cancel-text="取消"
        v-model="delUrlShow"
        @on-ok="okDelUrl"
        :styles="{top: '20px'}">

        <div class="boxContent">
          <span>确定删除该收藏吗？删除后不可恢复！</span>
        </div>
      </Modal>
      <Page :total="2000" show-elevator style="margin: 10px;float: right;" @on-change="changePage" :page-size="20"></Page>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  export default {
    data:function(){
      return{
        columns:[
          {
            title:'ID',
            key:'id',
            width:'80',
          },
          {
            title:'标题',
            key:'title',
            render:(h, params) =>{
              let  url =  params.row.url;
              let title = params.row.title;
              return h('a',{
                attrs: {
                  href: url,
                  target:'_blank'
                }
              },title)
              /*let dom = ``
               dom = `<a href="`+url+`" target="_blank">`+title+`</a>`
               return dom*/
            }
          },
          {
            title:'描述',
            key:'description'
          },
          {
            title:'缩略图',
            key:'thumb',
            render: (h,params) =>{
              if(params.row.thumb!=null && params.row.thumb!='' && params.row.thumb!='undefined'){
                let  imgs =  params.row.thumb;
                let  _that = this;
                return h('div',imgs.map(function (item,index) {
                  return h('img',{
                    'class':{
                      'report-table-img':true
                    },
                    attrs:{
                      src:item,
                    }
                  })
                }))
              }else {
                return '';
              }
            }
            /*render(row,col,index){
             if (row.thumb!=null && row.thumb!='' && row.thumb!='undefined'){
             let  imgs =  row.thumb;
             let dom = ``
             for (let i=0;i<imgs.length;i++){
             dom += `<img src="`+imgs[i]+`" class="report-table-img" alt="`+i+`">`
             }
             return dom
             }else {
             return ''
             }
             }*/
          },
          {
            title:'公开或私有',
            key:'type',
            width:'120',
            render(h,params){
              if (params.row.type==0)
                return '私有'
              else if (params.row.type==1)
                return '完全公开'
              else
                return '内部公开'
            }
          },
          {
            title:'分类',
            key:'catId',
            width:'120',
            render(h,params){
              if (params.row.catId==1)
                return '视频'
              else if(params.row.catId==2)
                return '投票'
              else if(params.row.catId==3)
                return '征集'
              else if(params.row.catId==4)
                return '抽奖'
              else if(params.row.catId==5)
                return '游戏'
              else if(params.row.catId==6)
                return '党政'
              else if(params.row.catId==7)
                return '展示'
              else if(params.row.catId==8)
                return '节日'
              else
                return '其它'
            }
          }
          ,
          {
            title:'操作',
            key:'',
            render:(h, params) =>{
              return h('div', [
                h('Button', {
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editUrl(params.row)
                    }
                  }
                }, '编辑活动'),
                h('Button', {
                  on: {
                    click: () => {
                      this.delUrl(params.index)
                    }
                  }
                }, '删除')
              ]);
            }

            /*render(row,col,index){
             return `<i-Button @click="editUrl(row)">编辑</i-Button>
             <i-Button @click="delUrl(${index})">删除</i-Button>`
             }*/
          }
        ],
        collectionList:[],
        paths:['首页','内容管理' ,'收藏管理','收藏列表'],
        delUrlShow:false,
        urlId:'',
        page:1,
        catId:'',
        catIdList:['所有','视频','投票','征集','抽奖','游戏','党政','展示','节日','其它']
      }
    },
    methods:{
      changePage(page){
        getCollectionList(this,page,'&catId='+this.catId);
        this.page=page;
      },
      addUrl(){
        this.$router.push({path:'/collection/addCollection'});
      },
      editUrl(row){
        this.$router.push({path:'/collection/addCollection',name:'addCollection',query:{collectionId:row.id},params:row});
      },
      delUrl(index){
        this.delUrlShow = true;
        this.urlId = this.collectionList[index].id;
      },
      okDelUrl(){
        var url = '/cms/collection/delete';
        var data = {
          id:this.urlId
        };
        postListJq(this,url,data);
      },
      searchList(catId){
        var url='&catId='+catId;
        this.catId = catId;
        getCollectionList(this,this.page,url)
      }
    },
    created:function () {
      getCollectionList(this,1,'&catId=0');
    },

    components:{
      bread:bread
    }
  }

  function postListJq(context,url,data) {
    context.$Loading.start();
    context.$.ajax({
      url:context.$BaseUrl+url,
      type:'post',
      contentType:'application/x-www-form-urlencoded',
      xhrFields: {
        withCredentials: true
      },
      data:data,
      success:function (resp) {
        context.$Message.success(resp.msg);
        context.$Loading.finish();
        getCollectionList(context,context.page,'&catId=0');
      },
      error:function (error) {
        context.$Loading.error()
      }
    })
  }
  function getCollectionList(context,page,url){
    context.$Loading.start();
    context.$.ajax({
      url:context.$BaseUrl+'/cms/collection/list?p='+page+url,
      type:'get',
      success:function (data) {
        context.collectionList = data.data.items;
        context.collectionList = data.data.items.map(function (item) {
          item.thumb = item.thumb.split(',');
          return item;
        });
        context.$Loading.finish();
      }
    })

  }



</script>
