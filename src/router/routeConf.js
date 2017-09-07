import Vue          from 'vue'
import Router       from 'vue-router'

//通用
import login        from '../components/pages/login.vue'
import pageFrame    from '../components/pages/pageFrame.vue'
import defaultPage  from '../components/pages/common/default.vue'

//杂项
import enroll520    from '../components/pages/enroll/enroll520.vue'
import readInfo     from '../components/pages/enroll/readInfo.vue'
import enrollUser   from '../components/pages/enroll/enrollUser.vue'
import enrollList   from '../components/pages/enroll/enrollList.vue'
import addEnroll    from '../components/pages/enroll/addEnroll.vue'
import newFrame     from '../components/pages/newframe.vue'

//系统管理
import menuList     from '../components/pages/systemManage/menuList.vue'
import roleManage   from '../components/pages/systemManage/roleManage.vue'
import sysUser      from '../components/pages/systemManage/sysUser.vue'
import loginLog     from '../components/pages/systemSafety/loginLog.vue'
import systemLog    from '../components/pages/systemSafety/systemLog.vue'
import druid        from '../components/pages/systemSafety/druid.vue'

//抽奖
import lotteryList  from '../components/pages/lottery/lotteryList.vue'
import editLottery  from '../components/pages/lottery/editLottery.vue'
import prizeConfig  from '../components/pages/lottery/prizeConfig.vue'
import winList      from '../components/pages/lottery/winingList.vue'
import userList     from '../components/pages/lottery/userList.vue'

//投票
import voteList     from '../components/pages/vote/voteList.vue'
import voteAdd      from '../components/pages/vote/addUpdateVote.vue'
import voteItemList from '../components/pages/vote/voteItemList.vue'
import addItem      from '../components/pages/vote/addItem.vue'

//邀请码
import inviteCode   from '../components/pages/inviteCode/inviteCodeList.vue'
import dataView     from '../components/pages/inviteCode/dataView.vue'

//收藏管理
import collectionList from '../components/pages/collection/collectionList.vue'
import addCollection  from '../components/pages/collection/addCollection.vue'
import caseList       from '../components/pages/collection/caseList.vue'

//发送短信
import msgList        from '../components/pages/SMS/msgList.vue'
import sendMsg        from '../components/pages/SMS/sendMsg.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {path:'/login', name:'login', component:login},
    {path:'/', component:newFrame,
       children:[
         {path: '/',                 name: 'default',       component:defaultPage},
         //报名
         {path: 'enroll/enroll520',  name: 'enroll520',     component:enroll520},
         {path: 'enroll/enrollUser', name: 'enrollUser',    component:enrollUser},
         {path: 'enroll/read',       name: 'read',          component:readInfo},
         {path: 'enroll/enrollList', name: 'enrollList',    component:enrollList},
         {path: 'enroll/addEnroll',  name: 'addEnroll',     component:addEnroll},
         //系统设置
         {path: 'system/menu',       name: 'menuList',      component:menuList},
         {path: 'system/role',       name: 'roleManage',    component:roleManage},
         {path: 'system/sysUser',    name: 'sysUser',      component:sysUser},
         {path: 'system/systemLog',  name: 'systemLog',     component:systemLog},
         {path: 'system/loginLog',   name: 'loginLog',      component:loginLog},
         {path: 'system/druid',      name: 'druid',         component:druid},
         //抽奖
         {path: 'lottery',           name: 'lottery',       component:lotteryList},
         {path: 'lottery/edit',      name: 'editById',      component:editLottery},
         {path: 'lottery/prizeConf', name: 'configPrize',   component:prizeConfig},
         {path: 'lottery/winList',   name: 'winList',       component:winList},
         {path: 'lottery/userList',  name: 'userList',      component:userList},
         //投票
         {path: 'vote',              name: 'vote',          component:voteList},
         {path: 'vote/addUpdate',    name: 'voteAdd',       component:voteAdd},
         {path: 'vote/voteItemList', name: 'voteItemList',  component:voteItemList},
         {path: 'vote/addItem',      name: 'addItem',       component:addItem},
         //邀请码
         {path: 'inviteCode/list',   name: 'inviteCode',    component:inviteCode},
         {path: 'inviteCode/view',   name: 'dataView',      component:dataView},
         //收藏
         {path: 'collection/list',   name: 'collectionList',component:collectionList},
         {path: 'collection/addCollection',name: 'addCollection',component:addCollection},
         {path: 'collection/case',   name: 'case',          component:caseList},
         //发送短信
         {path:'/SMS/msgList',name:'msgList',component:msgList},
         {path:'/SMS/sendMsg',name:'sendMsg',component:sendMsg}
       ]
    }
  ]
})

