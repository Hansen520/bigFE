import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */ '../views/Login')
  },
  {
    path: '/reg',
    name: 'reg',
    component: () => import(/* webpackChunkName: 'reg' */ '../views/Reg'),
    beforeEnter: (to, from, next) => {
      if (from.name === 'login') {
        // 如果说来自于登入界面则可以跳转到本页面
        next()
      } else {
        // 不然就回到登入界面
        next('/login')
      }
    }
  },
  {
    path: '/forget',
    name: 'forget',
    component: () => import(/* webpackChunkName: 'forget' */ '../views/Forget')
  }
]

const router = new VueRouter({
  routes
})

export default router
