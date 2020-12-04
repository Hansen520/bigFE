import Router from 'koa-router'
import contentController from '../../api/ContentController'

const router = new Router()

router.prefix('/content')

// 用户签到
router.post('/upload', contentController.uploadImg)

// 添加新帖
router.post('/add', contentController.addPost)

// 编辑帖子时候更新
router.post('/update', contentController.updatePost)

/**
 * 后台相关的接口
 */
// 删除帖子
router.post('/delete-post', contentController.deletePost)

// 更新帖子
router.post('/update-id', contentController.updatePostByTid)

// 对后台帖子权限批量设置
router.post('/update-post-settings', contentController.updatePostBatch)

export default router
