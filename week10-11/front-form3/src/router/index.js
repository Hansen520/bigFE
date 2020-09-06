import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [{
      path: '',
      name: 'index',
      component: () => import(/* webpackChunkName: 'index' */ '../views/channels/Index.vue')
    },
    {
      path: '/index/:catalog',
      name: 'catalog',
      component: () => import(/* webpackChunkName: 'template1'*/ '../views/channels/Template1.vue')
    }
  ]
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
  // 精确的对应选项
  linkExactActiveClass : 'layui-this',
  routes
})

export default router
