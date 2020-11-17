import { promises } from 'fs'
import Router from 'koa-router'
import Knex from '../../util/knex'
import Redis from '../../util/redis'

const router = new Router()
const knex = Knex.getKnex()
const redis = new Redis()

// 查询所有类别和类别里面所有的商品
router.get('/typeProduct', async ctx => {

    // 先从redis中判断是否有数据
    let res = await redis.getData('typeProduct')
    // 如果有数据，则从redis获取数据返回客户端
    if (res) {
        return ctx.body = { status: 1, data: res, msg: '查询成功' }
    } else {
        // 如果没数据则进行数据库操作，获取数据
        let data = await knex('category').select('*');
        for (let i = 0; i < data.length; i++) {
            // 根据cid查询热度最高的4条商品信息
            data[i].product = await knex('product')
                .select('*')
                .where('cid', data[i].id)
                .orderBy('heat', 'desc')
                .limit(4);
        }
        if (data) {
            // 从数据库成功获取数据后，返回给客户端，并把数据添加到redis中
            await redis.setData('typeProduct', data)
            return ctx.body = { status: 1, data: data, msg: '查询成功' }
        }
        ctx.body = { status: 0, msg: '查询失败' }
    }

})

// 获取最新商品
router.get('/getNewProductByCid', async ctx => {
    let cid = ctx.query.cid
    let key = 'new_prodoct_by_cid_' + cid
    let res = await redis.getData(key)
    if (res) {
        return ctx.body = { status: 1, data: res, msg: '查询成功' }
    } else {
        let data = await knex('product').select('*').where('cid', cid).orderBy('updatedate', 'desc').limit(2)
        if (data) {
            await redis.setData(key,data)
            return ctx.body = { status: 1, data: data, msg: '查询成功' }
        }
        ctx.body = { status: 0, msg: '查询失败' }
    }

})

// 根据商品id获取商品详情
router.get('/detail/:id', async ctx => {
    let id = ctx.params.id
    let key = 'detail_id_'+id
    let res = await redis.getData(key)
    if(res){
        return ctx.body = { status: 1, data: res, msg: '查询成功' }
    }
    let data = await knex('product').select('*').where('id', id).first()
    if (data) {
        redis.setData(key,data)
        return ctx.body = { status: 1, data: data, msg: '查询成功' }
    }
    ctx.body = { status: 0, msg: '查询失败' }
})

// 根据商品名称模糊查询
router.get('/findProductLikeName', async ctx => {
    let productName = ctx.query.productName
    console.log(productName + "ddddd")
    let currentPage = ctx.query.currentPage > 0 ? ctx.query.currentPage : 1
    // 每页记录数
    let size = 15
    // 商品查询结果
    let data = await knex('product').select('*')
        .where('productname', 'like', `%${productName}%`)
        .orderByRaw('quantity desc,id desc')
        .limit(size)
        .offset((currentPage - 1) * size)
    // 查询总记录数结果
    let rowResult = await knex('product').count('id')
        .where('productname', 'like', `%${productName}%`)
        .first()
    // 总记录数
    let totalRow
    // 总页数
    let totalPage
    if (rowResult !== undefined) {
        totalRow = rowResult.count
    }
    totalPage = Math.floor(totalRow % size === 0 ? totalRow / size : totalRow / size + 1)
    // 整合对象
    let result = Object.assign({ totalRow, currentPage, totalPage, data })
    if (data.length >= 0) {
        return ctx.body = { status: 1, data: result, msg: '查询成功' }
    }
    ctx.body = { status: 0, msg: '查询失败' }
})

// 根据类别查询商品，默认根据更新时间排序，可以按默认/人气/价格进行排序
router.get('/getProductByCid', async ctx => {
    let sortType = ctx.query.sortType === undefined ? 'desc' : ctx.query.sortType
    let sortProperty = ctx.query.sortProperty === undefined ? 'updatedate' : ctx.query.sortProperty
    let cid = ctx.query.cid
    let currentPage = ctx.query.currentPage > 0 ? ctx.query.currentPage : 1

    let size = 15
    let totalRow
    let totalPage
    let data = await knex('product').select('*')
        .where('cid', cid)
        .orderByRaw(`${sortProperty} ${sortType},id desc`)
        .limit(size)
        .offset((currentPage - 1) * size)
    let rowResult = await knex('product').count('id')
        .where('cid', cid).first()
    if (rowResult !== undefined) {
        totalRow = rowResult.count
    }
    totalPage = Math.floor(totalRow % size === 0 ? totalRow / size : totalRow / size + 1)
    let result = Object.assign({ totalRow, currentPage, totalPage, data })
    if (data !== undefined) {
        return ctx.body = { status: 1, data: result, msg: '查询成功' }
    }
    ctx.body = { status: 0, msg: '查询失败' }
})

// 查询商品库存
router.get('/findProductQuantity', async ctx => {
    let id = ctx.query.id
    let data = await knex('product').select('productname', 'quantity').where({ id }).first()
    if (data) {
        return ctx.body = { status: 1, data: data, msg: '查询成功' }
    }
    ctx.body = { status: 0, msg: '查询失败' }
})


export default router.routes()
