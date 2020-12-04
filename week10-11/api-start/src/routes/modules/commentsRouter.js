import Router from 'koa-router'
import commentsController from '../../api/CommentsController'

const router = new Router()

router.prefix('/comments')

// 添加评论
router.post('/reply', commentsController.addComment)
//更新评论
router.post('/update', commentsController.updateComment)
//最佳答案
router.post('/accept', commentsController.setBest)
// 评论点赞
router.get('/hands', commentsController.setHands)

export default router
