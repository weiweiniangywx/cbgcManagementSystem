<style lang="less" rel="stylesheet/less">
  @import "../../../assets/css/base.less";
  .leftSideBar{
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #464c5b;
    padding-top: 60px;
    overflow-y: auto;
    z-index: 10;
    transition: all 300ms ease-in-out;
  }
  .main-wrap.cb-left-collapse .leftSideBar{
    left: -240px;
  }
</style>

<template>
  <div class="leftSideBar">
    <Menu theme="dark" active-name="1">
        <Menu-item v-for="(menu,index) in menus"
                   :key="index+1"
                   @click.native="routeToUrl(menu.path)"
                   :name="index+1">{{menu.name}}</Menu-item>
    </Menu>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {
      methods:{
        routeToUrl: function (routeName) {
          routeName = routeName || '/'
          this.$router.push(routeName)
        }
      },
      props:['menus']
    }
</script>

