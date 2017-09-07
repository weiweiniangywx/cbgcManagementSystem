<style lang="less" rel="stylesheet/less">
  .router-link-active{
    background-color: #3C95D5;
    color: #fff!important;
  }
</style>

<template>
    <Menu ref="myMenu" theme="dark" width="180" :open-names="opens">
        <Submenu v-for="(menu,index) in menus"
                   :key="index+1"
                   :name="menu.menuName">
          <template slot="title">
            <Icon type="ios-paper"></Icon>
            {{menu.menuName}}
          </template>
          <template v-for="(sub,subIndex) in menu.subMenu">
            <router-link class="ivu-menu-item" :to="sub.menuUrl" tag="li" :name="(index+1)+''+(subIndex+1)">{{sub.menuName}}</router-link>
          </template>
        </Submenu>
    </Menu>
</template>

<script type="text/ecmascript-6">
    export default {
      props:['menus'],
      data () {
          return {
            opens:['活动管理','川观邀请码']
          }
      },
      mounted(){

      },
      watch:{
         menus:function () {
            this.opens = [];
            let that = this;
            this.menus.map(function (item,index) {
               that.opens.push(item.menuName)
            });
            this.$nextTick(function () {
              this.$refs['myMenu'].updateOpened();
            });
         }
      }
    }
</script>

