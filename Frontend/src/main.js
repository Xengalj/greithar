import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import ElementPlus from 'element-plus';
import GIcon from './components/template/GIcon.vue'
// import GTable from './components/template/GTable.vue'
const app = createApp(App);
app.use(router);
app.use(store);
app.use(ElementPlus);
app.component("g-icon", GIcon);

app.mount("#app");
