<style>
</style>
<template>
  <router-view></router-view>
</template>

<script type="text/ecmascript-6">
  export default {
    data (){
      return{}
    },
    created(){
      Date.prototype.toLocaleString_shim = function() {
        let Mon  = (this.getMonth() + 1) > 9 ? this.getMonth() + 1 : '0'+(this.getMonth() + 1),
          Date = (this.getDate()) > 9 ? this.getDate() : '0'+this.getDate(),
          Hour = (this.getHours()) > 9 ? this.getHours() : '0'+this.getHours(),
          Min  = (this.getMinutes()) > 9 ? this.getMinutes() : '0'+this.getMinutes();
        return this.getFullYear() + "-" + Mon + "-" + Date + " " + Hour + ":" + Min + ":00";
      };

      /*配置ajax全局拦截*/
      let that = this;
      that.$.ajaxSetup({
        xhrFields: {
          withCredentials: true
        },
        data:{
          ajax:true
        },
        error:function (xhr) {
        },
        statusCode:{
          911:function (xhr) {
            that.$router.push('/login');
          },
          401:function (xhr) {
            if(JSON.parse(xhr.responseText).code == '-401'){
              that.$Notice.error({
                title: '权限不够',
                desc: '您没有进行此项操作的权限，请联系郭伟伟老师',
                duration: 0
              });
            }
          }
        }
      });
    }
  }
</script>


