import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIcons from "@element-plus/icons-vue"; // 引入ElementPlus的图标库
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
// 注册ElementPlus的图标库
for (const [key, value] of Object.entries(ElementPlusIcons)) {
  app.component(key, value);
}
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.use(ElementPlus);


app.config.globalProperties.$courseTableSetting = {
  year: "2024",
  lastUpdate: "",
  mode: "0",//single or double
  term: "fall",//spring,summer,fall,winter
}

//全局变量
app.config.globalProperties.$courseTable = {
  year: "2024",
  lastUpdate: "",
  spring: {
    lastUpdate: "",
    courses: [],
  },
  summer: {
    lastUpdate: "",
    courses: [],
  },
  fall: {
    lastUpdate: "",
    courses: [],
  },
  winter: {
    lastUpdate: "",
    courses: [],
  },
};

app.config.globalProperties.$timeTable = [
  {"number": 1, "start": "8:00", "end": "8:45"},
  {"number": 2, "start": "8:50", "end": "9:35"},
  {"number": 3, "start": "10:00", "end": "10:45"},
  {"number": 4, "start": "10:50", "end": "11:35"},
  {"number": 5, "start": "11:40", "end": "12:25"},
  {"number": 6, "start": "13:25", "end": "14:10"},
  {"number": 7, "start": "14:15", "end": "15:00"},
  {"number": 8, "start": "15:05", "end": "15:50"},
  {"number": 9, "start": "16:15", "end": "17:00"},
  {"number": 10, "start": "17:05", "end": "17:50"},
  {"number": 11, "start": "18:50", "end": "19:35"},
  {"number": 12, "start": "19:40", "end": "20:25"},
  {"number": 13, "start": "20:30", "end": "21:15"}
]

app.mount("#app");
