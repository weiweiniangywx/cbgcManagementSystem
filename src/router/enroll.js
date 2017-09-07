/**
 * Created by zh on 2017/7/27.
 */
import enroll520    from '../components/pages/enroll/enroll520.vue'
import readInfo     from '../components/pages/enroll/readInfo.vue'
import enrollUser   from '../components/pages/enroll/enrollUser.vue'
import enrollList   from '../components/pages/enroll/enrollList.vue'
import addEnroll    from '../components/pages/enroll/addEnroll.vue'

export default [
  {path: 'enroll/enroll520',  name: 'enroll520',     component:enroll520},
  {path: 'enroll/enrollUser', name: 'enrollUser',    component:enrollUser},
  {path: 'enroll/read',       name: 'read',          component:readInfo},
  {path: 'enroll/enrollList', name: 'enrollList',    component:enrollList},
  {path: 'enroll/addEnroll',  name: 'addEnroll',     component:addEnroll}
]
