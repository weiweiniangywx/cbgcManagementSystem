import collectionList from '../components/pages/collection/collectionList.vue'
import addCollection  from '../components/pages/collection/addCollection.vue'
import caseList       from '../components/pages/collection/caseList.vue'

export default [
  {path: 'collection/list',   name: 'collectionList',component:collectionList},
  {path: 'collection/addCollection',name: 'addCollection',component:addCollection},
  {path: 'collection/case',   name: 'case',          component:caseList}
]
