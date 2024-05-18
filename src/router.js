import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './Home.vue'
import LoreView from './Lore.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/lore', component: LoreView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
