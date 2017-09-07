<style scoped>
  .custom{
    text-align: center;
    height: 780px;
  }
  .card-content{
    padding: 10px 0;
    column-count: 6;
    column-gap: 16px;
  }
  .item{
    position: relative;
    break-inside: avoid;
    box-sizing: border-box;
    padding: 0 10px 10px;
    border-radius: 5px;
    border: 1px solid #dddddd;
    margin-bottom: 10px;
    transition: background-color linear 150ms;
  }
  .item:hover{
    cursor: pointer;
    /*box-shadow: 0 3px 9px rgba(0,0,0,.3); #00c261*/
    background-color: rgba(0,194,97,.6);
    color: white;
  }
  .item a{
    color: inherit;
  }
  .item .item-title{
    padding: 10px 0;
    font-size: 18px;
  }
  .item .img-content{
    max-height: 600px;
    overflow: hidden;
  }
  .item .img-content > img{
    width: 100%;
  }
  .item .item-flag{
    padding: 2px 10px;
    position: absolute;
    left: 0;
    top: 6px;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    color: white;
    box-shadow: 0 3px 9px rgba(0,0,0,.3);
  }
  .item .item-flag.item-private{
    background-color: #ff9900;
  }
  .item .item-flag.item-public{
    background-color: #19be6b;
  }
  .type-btn{
    margin-right: 5px
  }
  @media screen and (max-width: 768px) {
    .card-content{
      column-count: 2;
    }
  }
  @media screen and (min-width: 769px){
    .card-content{
      column-count: 4;
    }
  }
  @media screen and (min-width: 1200px){
    .card-content{
      column-count: 6;
    }
  }
</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content">
        <div class="ctrl">
          <i-button v-for="(item,index) in $collectionType" :key="index" @click="search(item.catId)" class="type-btn">
            {{item.name}}
          </i-button>
          <Page :total="50" style="float: right" @on-change="changePage" ></Page>
        </div>
        <div class="card-content">
          <div class="item" v-for="(item,index) in caseList" :key="index">
            <a :href="item.url" target="_blank">
              <div class="item-title">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.title}}</div>
              <div class="img-content">
                <img :src="$imgfilter(item.thumb,'small')" :alt="item.description">
              </div>
              <div class="item-flag" :class="item.type === 1 ? 'item-public' : 'item-private' ">
                {{item.type === 1 ? '公开' : '私有' }}
              </div>
            </a>
          </div>
        </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  export default {
    data:function() {
      return {
        paths:['收藏管理','案例展示'],
        type:-1,
        catId:0,
        caseList:[]
      }
    },
    created:function(){
        _getCaseList(this);
    },
    components: {
      bread:bread
    },
    methods:{
      search(catId){
        this.catId = catId;
        _getCaseList(this,1,catId,this.type);
      },
      changePage(page){
        _getCaseList(this,page,this.catId,this.type)
      }
    }
  }

  function _getCaseList(context,page,catId,type) {
      let action = '';

      if(page !== undefined){
        action += ('&p='+page);
      }
      if(catId !== undefined && catId >= 0){
        action += ('&catId='+catId);
      }
      if(type !== undefined && type >= 0){
        action += ('&type='+type);
      }
      context.$Loading.start();
      context.$.ajax({
        type:'get',
        url:context.$BaseUrl+'/cms/collection/list?'+action,
        success(resp){
          context.$Loading.finish();
          context.caseList = resp.data.items;
        }
      })
  }
</script>
