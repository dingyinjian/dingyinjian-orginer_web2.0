import Vue from 'vue';
import App from './App.vue';
import {router} from './router';
import store from './store/index';

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import 'admin-lte/dist/js/adminlte.min.js';
import 'admin-lte/plugins/fontawesome-free/css/all.min.css';
import 'admin-lte/dist/css/adminlte.min.css';

//moment.js
import moment from 'moment';
Vue.prototype.$moment=moment;

//v-select
import vSelect from 'vue-select';
Vue.component('v-select', vSelect);
import 'vue-select/dist/vue-select.css';

//三级联动
import Distpicker from 'v-distpicker';
Vue.component('v-distpicker', Distpicker);

//时间范围选择
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/zh-cn';
Vue.component('date-picker',DatePicker);

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

export const vm = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')