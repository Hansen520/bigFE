
import Home from '@/views/Home.vue'

import users from './modules/user'
import login from './modules/login'
import content from './modules/content'

export default [
  {
    path: '/',
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
  ...content,
  ...login,
  ...users,
  {
    path: '/404',
    component: () => import(/* webpackChunkName: 'nofound' */ '../views/NoFound')
  },
  {
    path: '*',
    redirect: '/404'
  }
]
