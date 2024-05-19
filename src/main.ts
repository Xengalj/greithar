import './assets/main.css'

import { createApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css' // default Element Plus styles
import './styles/element/index.scss' // My Element Plus styles
import App from './App.vue'
import Router from './router.js'

const app = createApp(App)
app.use(Router)
app.use(ElementPlus, {size: 'small', zIndex: 3000})

app.mount('#app')
