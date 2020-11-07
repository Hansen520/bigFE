import Vue from 'vue'
import Router from 'vue-router'
import menus from './pages/menus'
import order from './pages/order'

// 注册插件
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'menus',
      component: menus
    },
    {
      path: '/order',
      name: 'order',
      component: order
    }
  ]
})