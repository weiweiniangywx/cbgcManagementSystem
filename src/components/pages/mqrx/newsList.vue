<style>
  .ivu-table td.status-type{
    text-align: center;
  }
  .reply-item{
    border-bottom: 1px solid #ddd;
    padding: 16px 150px 16px 16px;
    margin: 0 -16px;
    position: relative;
  }
  .reply-item:nth-of-type(1){
    padding-top: 0;
  }
  .reply-item .reply-item-delete{
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
</style>
<template>
  <div class="router-content">
    <bread :paths="paths"></bread>

    <div class="layout-content">
      <div style="overflow: hidden">
        <Page :total="50" style="margin-bottom: 10px;float: right" @on-change="changePage" ></Page>
      </div>
      <Table size="small" stripe border :columns="columns" :data="newss" height="740"></Table>
    </div>

    <!--修改文章-->
    <Modal
      v-model="modifyModal"
      width="1200"
      :styles="{top: '20px'}"
      :mask-closable="false">
      <div slot="header">
        <span style="font-size: 20px">新闻标题：</span><Input v-model="newsTitle" size="large" style="margin-top: 10px"></Input>
      </div>
      <input type="hidden" id="index">
      <div id="editorContent" style="min-height: 600px"></div>
      <div slot="footer">
        <Button  @click="modifyModal = false">取消</Button>
        <Button  type="primary" @click="saveNewsModify">保存</Button>
      </div>
    </Modal>

    <!--添加回复-->
    <Modal v-model="replyModal" width="900" :styles="{top: '20px','margin-bottom':'100px'}" :mask-closable="false">
      <h2 slot="header" style="line-height: 1.5">
        关于 "{{newsTitle}}" 的回复
      </h2>
      <input type="hidden" id="replyIndex">
      <!--回复列表-->
      <div v-if="reply.length!=0" v-for="(item,index) in reply" class="reply-item">
        <span style="color: #9ea7b4;font-size: 16px">{{index+1}}.来自 {{item.author}}&nbsp;&nbsp;&nbsp;时间 {{new Date(item.replyDate).toLocaleDateString()}}</span>
        <p style="font-size: 16px">{{item.content}}</p>
        <Poptip
          confirm
          title="确认删除这条回复吗？"
          @on-ok="deleteReply(item.id)"
          class="reply-item-delete">
          <Button type="error">删除</Button>
        </Poptip>
      </div>
      <div v-else class="reply-border">
        <h2 style="text-align: center">暂无回复，请添加回复</h2>
      </div>
      <div>
        <Form :model="replyInfo" label-position="left" :label-width="80" style="width: 600px;margin-top: 20px;text-align: center">
          <Form-item label="回复日期">
            <Date-picker type="date" placeholder="选择日期" v-model="replyInfo.replyDate"></Date-picker>
          </Form-item>
          <Form-item label="回复部门">
            <Input v-model="replyInfo.author" placeholder="请输入回复部门"></Input>
          </Form-item>
          <Form-item label="回复内容">
            <Input v-model="replyInfo.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
          </Form-item>
        </Form>
      </div>

      <div slot="footer">
        <Button  @click="cancelReply">取消</Button>
        <Button  type="primary" @click="saveReply">添加回复</Button>
      </div>

    </Modal>


  </div>
</template>

<script type="text/ecmascript-6">
    import bread from '../common/Breadrumb.vue'
    import ed from 'wangeditor'
    export default {
      data() {
        return {
          newss:[],
          page:1,
          columns:[
            {
              title:'ID',
              key:'id',
              width:80
            },
            {
              title:'新闻标题',
              key:'title',
              render(row){
                  if(row.sortNum == 0){
                    return row.title
                  }else if(row.sortNum == 1){
                    return  row.title+`&nbsp;<Tag color="red" size="small">已置顶</Tag>`
                  }else if(row.sortNum >1 && row.sortNum < 6){
                      return row.title+`&nbsp;<Tag color="red">row.sortNum</Tag>`
                  }
              }
            },
            {
              title:'添加时间',
              key:'gmtCreate',
              width:110,
              render (row, column, index) {
                return new Date(row.gmtCreate).toLocaleDateString();
              }
            },
            {
              title:'修改时间',
              key:'gmtModified',
              width:110,
              render (row, column, index) {
                return new Date(row.gmtCreate).toLocaleDateString();
              }
            },
            {
              title:'发布状态',
              key:'status',
              width:100,
              className: 'status-type',
              render(row, column, index){
                  if(row.status == '1'){
                    return `<Poptip  title="取消发布？" trigger="click" @on-ok="changeStatus(${index})" >
                       <div slot="title">修改为：</div>
                       <div slot="content">
                          <i-button type="warning" size="small" @click="changeStatus(${index},0)">未发布</i-button>
                          <i-button type="info" size="small" @click="changeStatus(${index},2)">已回复</i-button>
                       </div>
                       <i-button type="success" size="small" >已发布</i-button>
                       </Poptip>`
                  }else if(row.status == '0'){
                    return `<Poptip  confirm title="确认发布？" @on-ok="changeStatus(${index})">
                       <i-button type="warning" size="small">未发布</i-button>
                       </Poptip>`
                  }else if(row.status == '2'){
                    return `<Poptip  confirm title="取消回复？" @on-ok="changeStatus(${index})">
                       <i-button type="info" size="small">已回复</i-button>
                       </Poptip>`
                  }
              }
            },
            {
              title:'操作',
              key: 'action',
              width: 200,
              align: 'center',
              render (row, column, index) {
                return `<i-button type="primary" size="small" @click="showModal(${index})">查看/修改</i-button>
                        <i-button type="info" size="small" @click="showReply(${index})">回复</i-button>
                       <Poptip  placement="left" v-model="visible[${index}]">
                        <div slot="content">
                           <label for="">设置顺序</label>
                           <Input-number :min="1" v-model="sorts[${index}]"></Input-number>
                           <i-button  @click.sync="sortNewsByNum(${index})">确认</i-button><br>
                           <span>设置数字即为排序顺序<br>如需置顶则将本条新闻的排序设置为1</span>
                        </div>
                        <i-button type="ghost" size="small">排序</i-button>
                       </Poptip>
                        `;
              }
            }
          ],
          replyModal:false,
          modifyModal:false,
          reply:[],
          visible:[],
          sorts:[],
          replyInfo:{
            author:'',
            content:'',
            replyDate:''
          },
          newsTitle:'',
          paths:['民情热线','新闻列表'],
          editor:{},
        }
      },
      components:{
        bread:bread
      },
      methods:{
        /*显示新闻详情*/
        showModal(index){
            document.getElementById("index").value = index;
            this.editor.$txt.html(this.newss[index].content);
            this.newsTitle = this.newss[index].title;
            this.modifyModal = true;
        },

        /*显示新闻回复信息*/
        showReply(index){
          _showReply(this,index)
        },

        /*修改新闻状态*/
        changeStatus(index,to){
          modifyStatus(this,index,to);
        },

        /*保存新闻修改*/
        saveNewsModify(){
          _saveNewsModify(this);
        },

        /*切换页码*/
        changePage(page){
          getNews(this,page);
        },

        /*添加回复*/
        saveReply(){
          _saveReply(this)
        },

        /*取消回复*/
        cancelReply(){
            this.replyInfo.content = '';
            this.replyInfo.author = '';
            this.replyInfo.replyDate = '';
            this.reply = [];
            this.replyModal = false
        },

        /*删除某条回复*/
        deleteReply(id){
          _deleteReply(this,id)
        },

        //对新闻排序
        sortNewsByNum(index){
          _sortNewsByNum(this,index)
        }
      },
      created() {
        getNews(this,this.page);
      },
      mounted(){
        if(window.$ == undefined){
          window.jQuery = window.$ = this.$;
        }
        _createEditor(this);
      }
    }

    /**
     * 添加排序、显示字段
     * */
    function addAbilty(context) {
       let length = context.newss.length;
       for(let i=0; i<length; i++){
          context.visible[i] = false;
          context.sorts[i] = 1;
       }
    }

    /**
     * 拉取新闻
     * @param context vue-instance
     * @param page    number
     * */
    function getNews(context,page) {
      context.$Loading.start();
      context.$.ajax({
        url:context.$BaseUrl+'/mqrx/news/list?p='+page,
        type:'get',
        dataType:'json',
        success:function (data,a,b) {
          console.log(b.getAllResponseHeaders())
          context.newss = data.data.newss;
          addAbilty(context);
          context.page = page;
          context.$Loading.finish();
        }
      })
    }

    /**
     * 创建编辑器
     * @param context vue-instance
     * */
    function _createEditor(context){
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
           if (item === 'location') {
               return null;
           }
           return item;
       });

      editor.create();
      context.editor= editor;
    }

    /**
     * 新闻保存
     * @param context vue-instance
     * */
    function _saveNewsModify(context) {
      let index = parseInt(document.getElementById('index').value);
      context.$Loading.start()
      context.$.ajax({
        url:context.$BaseUrl+'/mqrx/news/update',
        type:'post',
        xhrFields: {
          withCredentials: true
        },
        data:{
          id:context.newss[index].id,
          reportId:context.newss[index].reportId,
          content:context.editor.$txt.html(),
          title:context.newsTitle
        },
        success:function (data) {
          getNews(context,context.page);
          context.$Loading.finish();
          context.modifyModal = false;
        },
        error:function (data) {
          context.$Message.error('网络错误');
          context.$Loading.error();
        }
      });
    }

    /**
     * 修改状态
     * @param context vue-instance
     * @param index {number}
     * @param to {number}
     * */
    function  modifyStatus(context,index,to) {
      let nowStatus = context.newss[index].status;
      let toStatus = 0;

      if(nowStatus == 0){
        toStatus = 1
      }else if(nowStatus == 1){
        if (to !== undefined && to !== ''){
            toStatus = to;
        }
      }else if(nowStatus == 2){
        toStatus = 1
      }
      let data = {
        id:context.newss[index].id,
        status:toStatus
      };
      context.$.ajax({
        url:context.$BaseUrl+'/mqrx/news/publish',
        type:'post',
        xhrFields: {
          withCredentials: true
        },
        data:data,
        success:function (resp) {
          context.newss[index].status = toStatus;
          context.$Message.success('修改成功');
          context.$Loading.finish();
        },
        error:function (error) {
          context.$Loading.error(error.msg)
        }
      })
    }

    /**
     * 拉取回复
     * @param context vue-instance
     * @param index number
     * */
    function _showReply(context,index) {
      document.getElementById("replyIndex").value = index;
      context.$.ajax({
        url:context.$BaseUrl+'/mqrx/news/reply/list?newsId='+context.newss[index].id,
        type:'get',
        xhrFields: {
          withCredentials: true
        },
        success:function (resp) {
          context.reply = resp.data.newsReplys.reverse();
          context.newsTitle = context.newss[index].title;
          context.replyModal = true;
          context.$Loading.finish();
        },
        error:function (error) {
          context.$Loading.error()
        }
      })
    }

    /**
     * 保存回复
     * @param context vue-instance
     * */
    function _saveReply(context) {
      let index =  document.getElementById("replyIndex").value;
      let replyData = {
          newsId:context.newss[index].id,
          reportId:context.newss[index].reportId,
          content:context.replyInfo.content,
          replyDate:context.replyInfo.replyDate,
          author:context.replyInfo.author
      };
      if (replyData.replyDate == ''){
        context.$Message.warning('请选择回复时间');
        return false;
      }
      if (replyData.author == ''){
        context.$Message.warning('请填写回复作者');
        return false;
      }
      if (replyData.content == ''){
        context.$Message.warning('请填写回复内容');
        return false;
      }
      context.$Loading.start()
      context.$.ajax({
        url:context.$BaseUrl+'/mqrx/news/reply/add',
        type:'post',
        data:replyData,
        success:function (data) {
          _showReply(context,index);
          context.replyInfo.content = ''
          context.replyInfo.author = ''
          context.replyInfo.replyDate = ''
          context.$Message.success(data.msg);
          context.$Loading.finish();
        }
      })
    }

    /**
     * 删除回复
     * */
    function  _deleteReply(context,id){
      let index =  document.getElementById("replyIndex").value;
      context.$Loading.start();
      context.$.ajax({
        url:context.$BaseUrl+'/mqrx/news/reply/delete',
        type:'post',
        contentType:'application/x-www-form-urlencoded',
        data:{id:id},
        success:function (resp) {
          context.$Message.success(resp.msg);
          _showReply(context,index);
          context.$Loading.finish();
        },
        error:function (error) {
          context.$Loading.error(error.msg)
        }
      })
    }
    /**
     * 新闻排序
     * */
    function _sortNewsByNum(context,index){
      console.log(context.visible)
      console.log(context.visible[index])
      context.visible[index] = false;
      console.log(context.visible[index])
    }
</script>


