import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
// ValidationProvider因为三个文件都用到，所以用到全局了
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import './local/validate'

Vue.config.productionTip = false
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
axios.defaults.baseURL = (process.env.NODE_ENV !== 'production') ? 'http://localhost:3000' : 'http://your.domain.com'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
