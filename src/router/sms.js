/**
 * Created by zh on 2017/7/27.
 */
import msgList        from '../components/pages/SMS/msgList.vue'
import sendMsg        from '../components/pages/SMS/sendMsg.vue'

export default [
  {path: 'sms/msgList',       name: 'msgList',       component:msgList},
  {path: 'sms/sendMsg',       name: 'sendMsg',       component:sendMsg}
]
