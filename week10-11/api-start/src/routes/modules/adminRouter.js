import Router from 'koa-router'
import contentController from '../../api/ContentController'

const router = new Router()

router.prefix('/admin')

// 获取标签列表
router.get('/get-tags', contentController.getTags)

// 添加标签
router.post('/add-tag', contentController.addTag)

// 删除标签
router.get('/remove-tag', contentController.removeTag)

// 编辑标签
router.post('/edit-tag', contentController.updateTag)

export default router