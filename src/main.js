import Vue from 'vue';
import store from "./store";
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';


import gv from './mixins/globalValiables';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);


Vue.mixin(gv);

axios.defaults.withCredentials = true;

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
