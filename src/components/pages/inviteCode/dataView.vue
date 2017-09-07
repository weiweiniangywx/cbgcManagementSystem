<style scoped>
</style>

<template>
  <div class="router-content">
    <bread :paths="paths"></bread>
    <div class="layout-content ">
      <div id="chart" style="height:400px;"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import bread from '../common/Breadrumb.vue'
  // 引入 ECharts 主模块
  import echarts from 'echarts/lib/echarts';
  import 'echarts/lib/chart/bar';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/component/title';
  import 'echarts/lib/component/legend'
  export default {
    data:function(){
      return{
        paths:['首页','邀请码','效果概览'],
      }
    },
    created:function(){

    },
    components:{
        bread
    },
    mounted(){
      _getInviteCodeList(this);
    }
  }

  function _getInviteCodeList(context) {
    context.$.ajax({
      type:'get',
      url:context.$BaseUrl+'/v2/cbgc/inviteCode/data/shizhou',
      success(resp){
        let x=[],c=[];
         resp.data.list.map(function (item) {
            x.push(item.name);
            c.push(item.count);
         });
         _createCharts(echarts,x,c);
      }
    })
  }
  function _createCharts(echarts,x,c) {
    let myChart = echarts.init(document.getElementById('chart'));

    // 指定图表的配置项和数据
    let option = {
      title: {
        text: '地市州邀请码激活情况'
      },
      tooltip: {},
      legend: {
        data:['激活量']
      },
      xAxis: {
        data: x,
        axisLabel:{interval:0,rotate:45}
      },
      yAxis: {},
      series: [{
        name: '激活量',
        type: 'bar',
        data: c
      }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }
</script>
