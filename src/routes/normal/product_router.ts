import Router from 'koa-router'
import ProductDao from '../../dao/productDao'

const router = new Router()

const product = new ProductDao()

// 查询所有类别和类别里面所有的商品
router.get('/typeProduct', async ctx => {
    let data = await product.findTypeProduct()
    if (data) {
        return ctx.body = { status: 1, data: data, msg: '查询成功' }
    }
    ctx.body = { status: 0, msg: '查询失败' }
})

// 获取最新商品
router.get('/getNewProductByCid', async ctx => {
    let data = await product.findNewProductByCid(ctx.query.cid)
    if (data) {
        return ctx.body = { status: 1, data: data, msg: '查询成功' }
    }
    ctx.body = { status: 0, msg: '查询失败' }
})

// 根据商品id获取商品详情
router.get('/detail/:id', async ctx => {
    let data = await product.findProductById(ctx.params.id)
    if (data) {
        return ctx.body = { status: 1, data: data, msg: '查询成功' }
    }
    ctx.body = { status: 0, msg: '查询失败' }
})

// 根据商品名称模糊查询
router.get('/findProductLikeName', async ctx => {
    let productName = ctx.query.productName
    let currentPage = ctx.query.currentPage > 0 ? ctx.query.currentPage : 1
    // 每页记录数
    let size = 15
    // 商品查询结果
    let data = await product.findProductLikeProductName({ productName, currentPage, size })
    // 查询总记录数结果
    let rowResult = await product.findProductLikeProductNameTotalRow(productName)
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
    let data = await product.findProductByCid({ cid, sortProperty, sortType, currentPage, size })
    let rowResult = await product.findProductByCidTotalRow(cid)
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
router.get('/findProductQuantity',async ctx=>{
    let id = ctx.query.id
    let data = await product.findProductQuantity(id);
    if(data){
        return ctx.body = { status: 1, data: data, msg: '查询成功' }
    }
    ctx.body = { status: 0, msg: '查询失败' }
})


export default router.routes()
