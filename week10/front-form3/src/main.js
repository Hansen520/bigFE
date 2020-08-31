import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './local/veevalidate'
import Alert from './components/modules/alert/index'

Vue.config.productionTip = false
Vue.use(Alert)
axios.defaults.baseURL = (process.env.NODE_ENV !== 'production') ? 'http://localhost:3000' : 'http://your.domain.com'
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
