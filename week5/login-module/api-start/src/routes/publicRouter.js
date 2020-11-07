import Router from 'koa-router'
import publicController from '../api/PublicController'

const router = new Router();
router.get('/getChapcha', publicController.getChapcha)

export default router