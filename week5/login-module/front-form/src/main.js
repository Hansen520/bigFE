import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VeeValidate, { Validator } from 'vee-validate'
// method1 to zh-cn
// import zh from 'vee-validate/dist/locale/zh_CN'
// Validator.localize('zh_CN', zh)

// method2 to zh-cn
import './local/index'
Vue.use(VeeValidate)
// 实例化Validator对象
const validator = new Validator()
// 通过自定义利用中文格式
validator.localize('zh-CN')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
