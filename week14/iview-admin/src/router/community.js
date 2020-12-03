import Main from '@/components/main'

export default [
  // 菜单分三种情况
  // 链接式的跳转 -> doc
  // 内嵌的子页面 -> Main Layout -> children
  // 一级菜单上添加的路由 （hideInMenu hideInBread）

  // 内容管理
  // 1. 文章管理 -> 文章内容管理, 文章标签管理(热门、精华 etc)
  // 如果只有一个孩子，那么一级就是孩子，如果二个孩子，就会显示二级菜单
  {
    path: '/content',
    name: 'article_management',
    //
    meta: {
      icon: 'md-albums',
      title: '文章管理'
    },
    // 基本上都是刷新一次
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
  },
  {
    path: '/menu',
    name: 'menu',
    meta: {
      icon: 'md-settings',
      title: '菜单管理'
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'menu_management',
        meta: {
          icon: 'ios-menu',
          title: '用户管理'
        },
        component: () => import('@/view/menu/index.vue')
      }
    ]
  },
  {
    path: '/roles',
    name: 'roles',
    meta: {
      icon: 'md-checkbox',
      title: '权限管理'
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'roles_management',
        meta: {
          icon: 'md-key',
          title: '角色权限'
        },
        component: () => import('@/view/roles/index.vue')
      }
    ]
  }
]
