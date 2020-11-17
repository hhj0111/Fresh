import Router from 'koa-router'
import Knex from '../../util/knex'

const router = new Router()
const knex = Knex.getKnex()

router.get('/getCategory', async ctx => {
    let data = await knex('category').select('*')
    if (data) {
        return ctx.body = { status: 1, data: data, msg: '查询成功' } 
    }
    ctx.body = { status: 0, msg: '查询失败' }
})

router.get('/findNameById', async ctx => {
    let id = ctx.query.id
    let data = await knex('category').select('categoryname').where({id}).first()
    if (data) {
        return ctx.body = { status: 1, data: data, msg: '查询成功' }
    }
    ctx.body = { status: 0, msg: '查询失败' }
})

export default router.routes()
