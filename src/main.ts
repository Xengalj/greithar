import './assets/main.css'

import { createApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from './App.vue'
import router from './router.js'

createApp(App).use(router).mount('#app')
