import voteList     from '../components/pages/vote/voteList.vue'
import voteAdd      from '../components/pages/vote/addUpdateVote.vue'
import voteItemList from '../components/pages/vote/voteItemList.vue'
import addItem      from '../components/pages/vote/addItem.vue'

export default [
  {path: 'vote',              name: 'vote',          component:voteList},
  {path: 'vote/addUpdate',    name: 'voteAdd',       component:voteAdd},
  {path: 'vote/voteItemList', name: 'voteItemList',  component:voteItemList},
  {path: 'vote/addItem',      name: 'addItem',       component:addItem}
]
