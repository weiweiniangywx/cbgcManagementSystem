/**
 * system manage.
 */
import menuList     from '../components/pages/systemManage/menuList.vue'
import roleManage   from '../components/pages/systemManage/roleManage.vue'
import sysUser      from '../components/pages/systemManage/sysUser.vue'
import loginLog     from '../components/pages/systemSafety/loginLog.vue'
import systemLog    from '../components/pages/systemSafety/systemLog.vue'
import druid        from '../components/pages/systemSafety/druid.vue'

export default [
  {path: 'system/menu',       name: 'menuList',      component:menuList},
  {path: 'system/role',       name: 'roleManage',    component:roleManage},
  {path: 'system/sysUser',    name: 'sysUser',      component:sysUser},
  {path: 'system/systemLog',  name: 'systemLog',     component:systemLog},
  {path: 'system/loginLog',   name: 'loginLog',      component:loginLog},
  {path: 'system/druid',      name: 'druid',         component:druid},
]
