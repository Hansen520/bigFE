import Router from 'koa-router'
import contentController from '../../api/ContentController'
import UserController from '../../api/UserController'
import adminController from '../../api/AdminController'

const router = new Router()

router.prefix('/admin')
/**
 * 后台相关接口
 */
// 获取标签列表
router.get('/get-tags', contentController.getTags)

// 添加标签
router.post('/add-tag', contentController.addTag)

// 删除标签
router.get('/remove-tag', contentController.removeTag)

// 编辑标签
router.post('/edit-tag', contentController.updateTag)

// 用户管理
router.get('/users', UserController.getUsers)

// 删除用户
router.post('/delete-user', UserController.deleteUserById)

// 更新用户
router.post('/update-user', UserController.updateUserById)

// 校验用户名是否冲突
router.get('/checkname', UserController.checkUsername)

// 添加用户
router.post('/add-user', UserController.addUser)

// 对后裔帖子权限批量设置
// router.post('/update-user-settings', UserController.updateUserBatch)

// 添加菜单
router.post('/add-menu', adminController.addMenu)
// 获取菜单
router.get('/get-menu', adminController.getMenu)
// 删除菜单
router.post('/delete-menu', adminController.deleteMenu)
// 更新菜单
router.post('/update-menu', adminController.updateMenu)
export default router
