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
router.get('/delete', contentController.deletePost)

// 更新帖子
router.post('/update-id', contentController.updatePostByTid)
export default router