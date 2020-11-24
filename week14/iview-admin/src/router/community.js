import Main from '@/components/main'

export default [
  // 菜单分三种情况
  // 链接式的跳转 -> doc
  // 内嵌的子页面 -> Main Layout -> children
  // 一级菜单上添加的路由 （hideInMenu hideInBread）

  // 内容管理
  // 1. 文章管理 -> 文章内容管理, 文章标签管理(热门、精华 etc)
  {
    path: '/content',
    name: 'article_management',
    meta: {
      icon: 'md-albums',
      title: '文章管理'
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'content_management',
        meta: {
          icon: 'ios-paper',
          title: '内容管理'
        },
        component: () => import('@/view/content/index.vue')
      },
      {
        path: 'tags',
        name: 'tags_management',
        meta: {
          icon: 'md-pricetags',
          title: '标签管理'
        },
        component: () => import('@/view/content/tags.vue')
      }
    ]
  },
  // 用户管理方面路由
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'md-admin',
      title: '用户管理'
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'user_management',
        meta: {
          icon: 'ios-people',
          title: '用户管理'
        },
        component: () => import('@/view/user/index.vue')
      }
    ]
  }
]
