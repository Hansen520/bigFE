export default [
  // 发帖
  {
    path: '/add',
    name: 'add',
    component: () => import(/* webpackChunkName: 'add' */ '@/components/contents/Add'),
    // 绑定路由云信息,就是说不能直接进入到/add
    meta: { requiresAuth: true }
  },
  {
    path: '/edit/:tid',
    props: true,
    name: 'edit',
    component: () => import(/* webpackChunkName: 'edit' */ '@/components/contents/Edit'),
    // 绑定路由云信息,就是说不能直接进入到/edit
    meta: { requiresAuth: true },
    beforeEnter(to, from, next){
      // 正常情况,如果就是从数组页面调过来的
      if(
        ['detail', 'mypost'].indexOf(from.name) !== -1 &&
        to.params.page &&
        to.params.page.isEnd === '0'
      ){
        next()
      }
      else{
        // 用户刷新了edit页面
        const editData = localStorage.getItem('editData')
        if(editData && editData !== ''){
          const editObj = JSON.parse(editData)
          if(editObj.isEnd === '0'){
            // 未结帖
            next()
          }else{
            next('/')
          }
        }else{
          next('/')
        }
      }
    }
  },
  {
    path: '/detail/:tid',
    name: 'detail',
    props: true,
    component: () => import(/* webpackChunkName: 'detail' */ '@/components/contents/Detail'),
    meta: {
      // 通过后台接口动态添加到路由 addRoutes
      // 也就是说满足下列数组条件才开发按钮
      types: ['get', 'add', 'delete']
    }
  }
]
