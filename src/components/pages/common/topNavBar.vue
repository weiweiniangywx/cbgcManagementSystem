<style scoped>

</style>

<template>
  <Menu mode="horizontal" theme="light" active-name="0">
    <Menu-item
      v-for="(menu,index) in menus"
      :name="index+1"
      :key="index+1"
      @click.native="routeToUrl(menu.path,index,menu.name)" >
      {{menu.name}}
    </Menu-item>
  </Menu>
</template>

<script type="text/ecmascript-6">
    export default {
      methods:{
        routeToUrl:function(url,index,name){
          url = url || '/'
          this.$emit('changeLeft',index,name);
          this.$router.push(url);
        }
      },
      props:['menus']
    }
</script>

