<style scoped>
  .if{
    width: 100%;
    height: calc(100vh - 60px);
  }
</style>

<template>
  <iframe :src="$domain+'/druid/index.html'" frameborder="0" class="if"></iframe>
</template>

<script type="text/ecmascript-6">
  export default {
    data:function(){
      return{}
    }
  }
</script>
