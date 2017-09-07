/**
 * Created by zh on 2017/7/27.
 */
import lotteryList  from '../components/pages/lottery/lotteryList.vue'
import editLottery  from '../components/pages/lottery/editLottery.vue'
import prizeConfig  from '../components/pages/lottery/prizeConfig.vue'
import winList      from '../components/pages/lottery/winingList.vue'
import userList     from '../components/pages/lottery/userList.vue'

export default [
  {path: 'lottery',           name: 'lottery',       component:lotteryList},
  {path: 'lottery/edit',      name: 'editById',      component:editLottery},
  {path: 'lottery/prizeConf', name: 'configPrize',   component:prizeConfig},
  {path: 'lottery/winList',   name: 'winList',       component:winList},
  {path: 'lottery/userList',  name: 'userList',      component:userList}
]
