import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routers'
import store from '@/store'
// import jwt from 'jsonwebtoken'
import moment from 'moment'

Vue.use(VueRouter)
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
    // const payload = jwt.decode(token)
    // base-64 编码使用方法是 atob()-此为解码
    const payload = JSON.parse(atob(token.split('.')[1]))
    // 如果说登入的token(jwt)还在时间内说明时间还没有过期(后台本人设置为1d过期),则取到localStorage里面的token和用户信息可以直接登入
    if(moment().isBefore(moment(payload.exp * 1000))){
      store.commit('setToken', token)
      store.commit('setUserInfo', userInfo)
      store.commit('setIsLogin', true)// 登入

      if(!store.state.ws){
        store.commit('initWebSocket', {})
      }
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
