import { createApp } from 'vue'
import { store, key } from './store'

import App from './App.vue'
import router from './router'
import store from "./store";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const app = createApp(App);

app.use(Antd);
app.use(store, key);
app.use(router).mount('#app');
