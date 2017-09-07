<style scoped>
  .btn-group{
    margin: 10px 0;
  }
  .cb-table{
    width: 100%;
    border-collapse: collapse;
  }
  .cb-table > thead > tr > th,
  .cb-table > tbody > tr > td{
    border: 1px solid #dddddd;
    vertical-align: middle;
    height: 40px;
    padding: 5px 10px;
  }
  .cb-table > thead > tr > th{
    text-align: center;
  }
  .cb-table > tbody > tr:hover td
  .cb-table > tbody > tr:hover td{
     background-color: #ebf7ff;
  }
</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>

    <div class="layout-content ">
      <!--<Table ref="table" stripe border :columns="tableColumns" :data="tableData"></Table>-->
      <table class="cb-table">
        <thead>
          <tr>
            <th>奖品名称</th>
            <th>类型</th>
            <th>虚拟奖品ID</th>
            <th>位置</th>
            <th>奖品总数</th>
            <th>已中奖数量</th>
            <th>剩余奖品数量</th>
            <th>单用户中奖次数限制</th>
            <th>中奖率(总几率为10W)</th>
            <th style="min-width: 250px">中奖提示消息</th>
            <th style="min-width: 100px">操作</th>
          </tr>
        </thead>
        <tbody>
        <template v-if="tableData.length>0">
          <tr v-for="(item,index) in tableData" :key="index">
            <td>
              <Input v-model="item.name"></Input>
            </td>
            <td>
              <Select v-model="item.type">
                <Option v-for="(item1,index1) in typeList" :value="item1.value" :key="index1">{{ item1.label }}</Option>
              </Select>
            </td>
            <td>
              <Input v-model="item.couponId"></Input>
            </td>
            <td>
              <Input v-model="item.position"></Input>
            </td>
            <td>
              <Input v-model="item.total"></Input>
            </td>
            <td>
              <Input v-model="item.winningCount"></Input>
            </td>
            <td>
              {{item.total - item.winningCount}}
            </td>
            <td>
              <Input v-model="item.singleLimitCount"></Input>
            </td>
            <td>
              <Input v-model="item.rate"></Input>
            </td>
            <td>
              <Input v-model="item.winningMessage"></Input>
            </td>
            <td>
              <Button type="primary"  @click="wining_search(item.id)">中奖查询</Button>
            </td>
          </tr>
        </template>
        <template v-else>
          暂无数据
        </template>
        </tbody>
      </table>

      <div class="btn-group">
        <Button @click="handleSubmit">保存全部</Button>
        <Button @click="addPrize">新增奖品</Button>
        <span style="color: red"><Icon type="alert-circled"></Icon>奖品新增后不能删除，只能修改</span>
      </div>

    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  export default {
    data:function(){
      return{
        routerParams:this.$route.query,
        paths:['首页','运营管理','抽奖','配置奖品'],
        typeList:[
          {
            value: 1,
            label: '实物奖'
          },
          {
            value: 2,
            label: '参与奖'
          },
          {
            value: 3,
            label: '虚拟奖'
          },
        ],
        tableData:[],
      }
    },
    created:function(){
        _getPrizeList(this);
    },
    components:{
        bread:bread
    },
    methods:{
      wining_search(id){
        this.$router.push({
          path:'/lottery/winList',
          query:{
            activityId:this.routerParams.activityId,
            prizeId:id
          }
        })
      },
      addPrize(){
        let obj = {
          activityId: this.routerParams.activityId,
          name: "",
          picPath: "",
          type: 1,
          value: 1,
          total: 0,
          winningCount: 0,
          singleLimitCount: 0,
          rate: 0,
          position: 0,
          winningMessage: "",
          couponId: 0
        };
        this.tableData.push(obj);
      },
      go_Back(){
         history.go(-1);
      },
      handleSubmit(){
          let totalRate = 0;
          this.tableData.map(function (item) {
              totalRate += parseInt(item.rate);
          });
          if (totalRate !== 100000){
            this.$Message.error('中奖几率之和必须为 100,000 (10w)');
            return false;
          }
          let that = this;
          that.$.ajax({
            type:'post',
            url:that.$BaseUrl+'/v2/lottery/updatePrizes',
            contentType:'application/json',
            data:JSON.stringify(that.tableData),
            success(resp){
              that.$Message.success(resp.msg);
            }
          })
      }
    }
  }

  function _getPrizeList(context) {
      context.$Loading.start();
      context.$.ajax({
        type:'get',
        url:context.$BaseUrl+'/v2/lottery/prizesConfig',
        data:{
          activityId:context.routerParams.activityId
        },
        success(resp){
            context.$Loading.finish();
            context.tableData = resp.data.prizes;
        }
      })
  }
</script>
