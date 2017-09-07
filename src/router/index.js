import Vue          from 'vue'
import Router       from 'vue-router'

//通用
import { login, defaultPage, frame} from './common'

//模块
import system from './systemManage'
import lottery from './lottery'
import vote from './vote'
import enroll from './enroll'
import inviteCode from './inviteCode'
import collection from './collection'
import sms from './sms'

Vue.use(Router);

export default new Router({
  routes: [
    {path:'/login', name:'login', component:login},
    {path:'/', component:frame,
       children:[
         {path: '/',name: 'default',component:defaultPage},
         //报名
         ...enroll,
         //系统设置
         ...system,
         //抽奖
         ...lottery,
         //投票
         ...vote,
         //邀请码
         ...inviteCode,
         //收藏
         ...collection,
         //发送短信
         ...sms
       ]
    }
  ]
})

