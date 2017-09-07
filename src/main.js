// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import jq from 'jquery'
import axios from 'axios'
import 'iview/dist/styles/iview.css'
import './assets/css/reset.less';
import './assets/css/main.css'

Vue.config.productionTip = false;

/*挂载工具到全局vue对象*/
Vue.use(iView);
Vue.prototype.$ = jq;
Vue.prototype.$http = axios;
Vue.prototype.$domain = "https://mossapi.chuanbaoguancha.cn";
Vue.prototype.$BaseUrl = "https://mossapi.chuanbaoguancha.cn/admin";
Vue.prototype.$imgUploadUrl = "https://mossapi.chuanbaoguancha.cn/upload/img";
Vue.prototype.$collectionType = [
  {name:'所有',catId:0},
  {name:'党政',catId:6},
  {name:'展示',catId:7},
  {name:'视频',catId:1},
  {name:'投票',catId:2},
  {name:'征集',catId:3},
  {name:'抽奖',catId:4},
  {name:'游戏',catId:5},
  {name:'节日',catId:8},
  {name:'其它',catId:9}
];

Vue.prototype.$imgfilter = function (url,width) {
  const type = {
    middle:760,
    small:360
  };
  if(url.match(/img0.chuanbaoguancha.cn/i)){
      return url+'_w'+type[width];
  }else {
      return url;
  }
};
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
