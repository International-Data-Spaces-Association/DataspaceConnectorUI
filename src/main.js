import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import routes from "./routes/routes";
import VueApexCharts from 'vue-apexcharts';
import FlowChart from 'flowchart-vue';


// configure router
const router = new VueRouter({
  mode: 'history',
  routes, // short for routes: routes
  linkExactActiveClass: "nav-item active"
});

Vue.use(VueRouter);
Vue.use(FlowChart);
Vue.component('apexchart', VueApexCharts)

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App),
  router
}).$mount('#app')
