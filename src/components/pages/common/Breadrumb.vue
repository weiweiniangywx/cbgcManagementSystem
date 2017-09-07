<template>
  <div class="layout-breadcrumb" style="">
    <Breadcrumb style="float: left">
      <Breadcrumb-item v-for="path in paths" :key="paths.indexOf(path)">{{path}}</Breadcrumb-item>
    </Breadcrumb>
    <Button size="small" style="margin-left: 10px" @click="GO_BACK"><Icon type="arrow-left-c"></Icon> 返回</Button>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {
      data:function(){
        return {
        }
      },
      props:['paths'],
      methods:{
        GO_BACK(){
            history.go(-1);
        }
      }
    }
</script>

<style scoped>
  .layout-breadcrumb{
    padding: 10px 15px 0;
  }
</style>
