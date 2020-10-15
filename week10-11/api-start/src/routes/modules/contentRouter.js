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

export default router