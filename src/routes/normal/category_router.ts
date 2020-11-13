import CategoryDao from '../../dao/categoryDao'
import Router from 'koa-router'

const router = new Router()

const category = new CategoryDao()

router.get('/getCategory', async ctx => {
    let data = await category.findAll()
    if (data) {
        return ctx.body = { status: 1, data: data, msg: '查询成功' } 
    }
    ctx.body = { status: 0, msg: '查询失败' }
})

router.get('/findNameById', async ctx => {
    let data = await category.findNameById(ctx.query.id)
    if (data) {
        return ctx.body = { status: 1, data: data, msg: '查询成功' }
    }
    ctx.body = { status: 0, msg: '查询失败' }
})

export default router.routes()
