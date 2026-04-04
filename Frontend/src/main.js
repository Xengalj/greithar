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

app.config.globalProperties.$sayHello = (name) => `Hello, ${name}!`;


/***************************\
*                           *
*          HELPERS          *
*                           *
\***************************/
/*
 * Capitalize the first letter in the given string, using regex
 * * string = the string to capitalize
 */
app.config.globalProperties.$capFirsts = ( string ) => { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; };

/*
 * Manually add a bonus to the given object
 * * name = name of the bonus to add
 * * value = value of the bonus to add
 * * obj = the object to add the bonus to
 */
app.config.globalProperties.$applyBonus = ( name, value, obj ) => {
  if (value != 0) {
    let prefix = (value > 0) ? "+" : "";
    obj.total += value;
    obj.sources.push(`${prefix}${value} ${name}`);
  }
};


app.mount("#app");
