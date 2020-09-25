import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import store from '@/store'
import jwt from 'jsonwebtoken'
import moment from 'moment'

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
    }]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */ '../views/Login')
  },
  {
    path: '/confirm',
    name: 'confirm',
    component: () => import(/* webpackChunkName: 'confirm' */ '../views/Confirm')
  },
  {
    path: '/reset',
    name: 'reset',
    component: () => import(/* webpackChunkName: 'reset' */ '../views/Reset')
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
  },
  {
    path: '/user/:uid',
    name: 'user',
    props: true,
    component: () => import(/* webpackChunkName: 'forget' */ '../views/User')
  },
  {
    path: '/center',
    name: 'center',
    // 绑定路由云信息
    meta: { requiresAuth: true },
    linkExactActiveClass: 'layui-this',
    component: () => import(/* webpackChunkName: 'Center' */ '../views/Center'),
    children: [
      {
        // ''代表点击/center后默认进入到center
        path: '',
        name: 'center',
        component: () => import(/* webpackChunkName: 'user-center' */ '../components/user/Center'),
      },
      {
        path: 'set',
        name: 'set',
        component: () => import(/* webpackChunkName: 'settings' */ '../components/user/Settings'),
        children: [
          {
            // path为''则表示默认进入到这个路径
            path: '',
            name: 'info',
            component: () => import(/* webpackChunkName: 'info' */ '../components/user/common/MyInfo.vue')
          },
          {
            path: 'pic',
            name: 'pic',
            component: () => import(/* webpackChunkName: 'pic' */ '../components/user/common/PicUpload.vue')
          },
          {
            path: 'passwd',
            name: 'passwd',
            component: () => import(/* webpackChunkName: 'password' */ '../components/user/common/Passwd.vue')
          },
          {
            path: 'account',
            name: 'account',
            component: () => import(/* webpackChunkName: 'account' */ '../components/user/common/Accounts.vue')
          }
        ]
      },
      {
        path: 'posts',
        name: 'posts',
        component: () => import(/* webpackChunkName: 'user-posts' */ '../components/user/Posts'),
        children: [
        {
          path: '',
          name: 'mypost',
          component: () => import(/* webpackChunkName: 'mypost' */ '../components/user/common/MyPost.vue')
        },
        {
          path: 'mycollection',
          name: 'mycollection',
          component: () => import(/* webpackChunkName: 'mycollection' */ '../components/user/common/MyCollection.vue')
        }
      ]
      },
      {
        path: 'msg',
        name: 'msg',
        component: () => import(/* webpackChunkName: 'user-msg' */ '../components/user/Msg'),
      },
      {
        path: 'others',
        name: 'others',
        component: () => import(/* webpackChunkName: 'others' */ '../components/user/Others'),
      }
    ],
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: 'nofound' */ '../views/NoFound')
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  // 精确的对应选项
  linkExactActiveClass : 'layui-this',
  routes
})
// 全局的路由守卫
router.beforeEach((to, from, next) => {
  // 如果当你退出后依然有token和userinfo
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  if(token !== '' && token != null){
    const payload = jwt.decode(token)
    // 如果说登入的token(jwt)还在时间内说明时间还没有过期(后台本人设置为1d过期),则取到localStorage里面的token和用户信息可以直接登入
    if(moment().isBefore(moment(payload.exp * 1000))){
      store.commit('setToken', token)
      store.commit('setUserInfo', userInfo)
      store.commit('setIsLogin', true)// 登入
    } else {// 否则就清除本地缓存
      localStorage.clear()
    }
  }
  // 判断有无状态量
  if(to.matched.some(record => record.meta.requiresAuth)){
    const isLogin = store.state.isLogin
    // 需要用户登入的页面进行区别
    if(isLogin) {// 比如只有登入了才能进入center页，否则进入登入页
      next()
    } else {
      next('/login')
    }
  } else{
    // 公共页面，不需要用户登入也可以跳转
    next()
  } 
})

export default router
