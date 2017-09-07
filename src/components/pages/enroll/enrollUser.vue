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
  .info td span:first-child{
    color: darkgray;
    font-size: 14px;
  }
  .info td span:last-child{
    font-size: 16px;
  }
  /*td{border:solid #add9c0; border-width:0px 1px 1px 0px; }
  table{border:solid #add9c0; border-width:1px 0px 0px 1px;}*/
  .info td{
    border: solid darkgrey;
    border-width:0 1px 1px 0;
    width: 290px;
    padding: 5px;
  }
  .info table{
    border: solid darkgrey;
    border-width:1px 0 0 1px;
  }
  .info td:first-child{
    width: 25%;
  }
  .info td:nth-child(2){
    width: 25%;
  }
  .info td:nth-child(3){
    width: 25%;
  }
  .info td:last-child{
    width: 25%;
  }
</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content">
      <div style="overflow: hidden">
        <Page :total="1000" show-elevator style="margin-bottom: 10px;float: right" @on-change="changePage" :page-size="20"></Page>
      </div>
      <Table size="small" stripe border :columns="itemTable" :data="items"></Table>
    </div>

    <Modal
      title=" 用户信息"
      okText= '确定'
      cancelText= ''
      v-model="showUserInfo"
      :styles="{top: '20px',width:'1000px'}">
      <div class="info" style="padding: 20px;font-size: 14px">
        <table width="920px" border="1"  cellspacing='0'>
          <tr>
            <td><span>姓名:</span><span>{{this.userName}}</span></td>
            <td><span>性别:</span><span>{{this.userSex}}</span></td>
            <td><span>年龄:</span><span>{{this.userAge}}</span></td>
            <td><span>电话号码:</span><span>{{this.userPhone}}</span></td>
          </tr>
          <tr>
            <td><span>城市:</span><span>{{this.userCity}}</span></td>
            <td><span>公司:</span><span>{{this.userCompany}}</span></td>
            <td><span>邮箱:</span><span>{{this.userEmail}}</span></td>
            <td><span>地址:</span><span>{{this.userAddress}}</span></td>
          </tr>
          <tr>
            <td><span>创建时间:</span><span>{{this.userGmtCreate}}</span></td>
            <td><span>更改时间:</span><span>{{this.userGmtModified}}</span></td>
            <td><span>用户ID:</span><span>{{this.userId}}</span></td>
            <td><span>IP地址:</span><span>{{this.userIp}}</span></td>
          </tr>
          <tr class="three">
          <td> <span>QQ:</span><span>{{this.userQQ}}</span></td>
          <td><span>昵称:</span><span>{{this.userNick}}</span></td>
          <td colspan="2"><span>评论:</span><span>{{this.userRemark}}</span></td>
        </tr>
          <tr class="three">
            <td><span style="margin-right: 20px;font-size: 14px"><Icon type="images"></Icon>图片:<a v-show="userPics!=null&& userPics!='' && userPics!='undefined'" v-for="(item,index) in userPics" :href="this.userPics"><img :src="userPics[index]" class="report-table-img" alt=""></a></span></td>
            <td><span style="font-size: 14px;"><Icon type="link"></Icon>附件:<a v-show="userAttachement!=null&& userAttachement!='' && userAttachement!='undefined'" v-for="(item,index) in userAttachement" :href="userAttachement[index]"><img :src="userAttachement[index]" class="report-table-img" alt="" ></a></span></td>
            <td colspan="2"><span>微信ID:</span><span>{{this.userWechatOpenid}}</span></td>
          </tr>

          <tr>
            <td colspan="4"><span>标题:</span><span>{{this.userTopic}}</span></td>
          </tr>
          <tr>
            <td colspan="4"><span>内容:</span><span>{{this.userIntro}}</span></td>
          </tr>
        </table>
        <br/>
      </div>
    </Modal>

    <div :class="{'show':isViewShow}" class="imgViewer">
      <a @click.prevent="viewPrev" class="viewCtrl left"><Icon type="chevron-left"></Icon></Icon></a>
      <img :src="this.userAttachement" >
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
            title:'用户ID',
            key:'id',
            align: 'center',

          },
          {
            title:'用户姓名',
            key:'name',

          },
          {
            title:'电话号码',
            key:'phone',

          },
          {
            title:'性别',
            key:'sex',

          },
          {
            title:'标题',
            key:'topic',

          },
          {
            title:'城市',
            key:'city',

          },
          {
            title:'昵称',
            key:'nick',

          },
          {
            title:'开始时间',
            key:'gmtCreate',

          },
          {
            title:'IP地址',
            key:'ip'
          },
          {
            title:'图片',
            key:'pics',
            /*render(row,col,index){
             if (row.pics!=null && row.pics!='' && row.pics!='undefined'){
             let  imgs =  row.pics;
             let dom = ``
             for (let i=0;i<imgs.length;i++){
             dom += `<img src="`+imgs[i]+`" class="report-table-img" alt="`+i+`" @click="view(${index},`+i+`)">`
             }
             return dom
             }else {
             return ''
             }
             }*/
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
            title:'操作',
            width:150,
            align:'center',
            render:(h, params) =>{
              return h('Button', {
                on: {
                  click: () => {
                    this.showItem(params.index)
                  }
                }
              }, '展示')
          }}
        ],
        visible: false,
        imgSrc:'',
        viewPics:[],
        viewImgIndex:0,
        isViewShow:false,
        paths:['首页','活动','活动用户'],
        showUserInfo:false,
        userName:'',
        userId:'',
        userEnrollItemId:'',
        userPhone:'',
        userSex:'',
        userTopic:'',
        userIntro:'',
        userPics:'',
        userAge:'',
        userAttachement:'',
        userCity:'',
        userCompany:'',
        userEmail:'',
        userAddress:'',
        userRemark:'',
        userQQ:'',
        userWechatOpenid:'',
        userNick:'',
        userGmtCreate:'',
        userGmtModified:'',
        userIp:''

      }
    },
    created:function(){
      getUserList(this,1)
    },
    components:{
      bread:bread
    },
    methods:{
      changePage(page){
        getUserList(this,page);

      },
      handleView (img) {
        this.imgSrc = img;
        this.visible = true;
      },
      showItem(index){
        this.userName = this.items[index].name;
        this.userId = this.items[index].id;
        this.userEnrollItemId = this.items[index].enrollItemId;
        this.userPhone = this.items[index].phone;
        this.userSex = this.items[index].sex;
        this.userTopic = this.items[index].topic;
        this.userIntro = this.items[index].intro;
        this.userPics = this.items[index].pics;
        this.userAge = this.items[index].age;
        this.userAttachement = this.items[index].attachment;
        this.userCity = this.items[index].city;
        this.userCompany = this.items[index].company;
        this.userEmail = this.items[index].email;
        this.userAddress = this.items[index].address;
        this.userRemark = this.items[index].remark;
        this.userQQ = this.items[index].qq;
        this.userWechatOpenid = this.items[index].wechatOpenid;
        this.userNick = this.items[index].nick;
        this.userGmtCreate = this.items[index].gmtCreate;
        this.userGmtModified = this.items[index].gmtModified;
        this.userIp = this.items[index].ip;
        this.showUserInfo = true;

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
          this.viewImgIndex = maxIndex;
        }else {
          this.viewImgIndex--;
        }
      },
      viewNext(){
        let maxIndex = this.viewPics.length-1;
        if(this.viewImgIndex == maxIndex){
          this.viewImgIndex = 0;
        } else {
          this.viewImgIndex++;
        }
      },
      viewClose(){
        this.isViewShow = false;
        document.body.style.overflow = 'auto'
      }
    }
  }
  function getUserList(context,page) {
    context.$.ajax({
      type:'get',
      url:context.$BaseUrl+'/enroll/user/list?itemId=2&p='+page,
      success(resp){

        context.items = resp.data.users.map(function (item) {
          if (item.attachment!=null && item.attachment!='' && item.attachment!='undefined') {
            item.attachment = item.attachment.split(',');
          }
          if (item.pics!=null && item.pics!='' && item.pics!='undefined') {
            item.pics= item.pics.split(',');
          }
          if (item.gmtCreate!=null && item.gmtCreate!='' && item.gmtCreate!='undefined') {
            item.gmtCreate = new Date(item.gmtCreate).toLocaleString()
          }
          return item;
        });
      }
    })
  }


</script>
