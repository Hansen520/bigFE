export default [
  {
    path: '/center',
    // 绑定路由云信息,就是说不能直接进入到/center
    meta: { requiresAuth: true },
    linkExactActiveClass: 'layui-this',
    component: () => import(/* webpackChunkName: 'Center' */ '@/views/Center'),
    children: [
      {
        // ''代表点击/center后默认进入到center
        path: '',
        name: 'center',
        component: () => import(/* webpackChunkName: 'user-center' */ '@/components/user/Center'),
      },
      {
        path: 'set',
        component: () => import(/* webpackChunkName: 'settings' */ '@/components/user/Settings'),
        children: [
          {
            // path为''则表示默认进入到这个路径
            path: '',
            name: 'info',
            component: () => import(/* webpackChunkName: 'info' */ '@/components/user/common/MyInfo.vue')
          },
          {
            path: 'pic',
            name: 'pic',
            component: () => import(/* webpackChunkName: 'pic' */ '@/components/user/common/PicUpload.vue')
          },
          {
            path: 'passwd',
            name: 'passwd',
            component: () => import(/* webpackChunkName: 'password' */ '@/components/user/common/Passwd.vue')
          },
          {
            path: 'account',
            name: 'account',
            component: () => import(/* webpackChunkName: 'account' */ '@/components/user/common/Accounts.vue')
          }
        ]
      },
      {
        path: 'posts',
        component: () => import(/* webpackChunkName: 'user-posts' */ '@/components/user/Posts'),
        children: [
        {
          path: '',
          name: 'mypost',
          component: () => import(/* webpackChunkName: 'mypost' */ '@/components/user/common/MyPost.vue')
        },
        {
          path: 'mycollection',
          name: 'mycollection',
          component: () => import(/* webpackChunkName: 'mycollection' */ '@/components/user/common/MyCollection.vue')
        }
      ]
      },
      {
        path: 'msg',
        name: 'msg',
        component: () => import(/* webpackChunkName: 'user-msg' */ '@/components/user/Msg'),
      },
      {
        path: 'others',
        name: 'others',
        component: () => import(/* webpackChunkName: 'others' */ '@/components/user/Others'),
      }
    ],
  },
  {
    path: '/user/:uid',
    name: 'home',
    props: true,
    component: () => import(/* webpackChunkName: 'home' */ '@/views/User')
  },
]
