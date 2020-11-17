import Router from 'koa-router'
import token from '../../util/token'
import parseToken from '../../util/parseHeaderToken'
import Knex from '../../util/knex'

const router = new Router()
const knex = Knex.getKnex()

// 添加订单
// 接收参数
/* 
    order:          id orderTime userId totalPrice
    orderDetail:    id orderId productId quantity orderNum  

    [
        { productId, quantity },
        { productId, quantity }
    ]
    
*/
router.post('/addOrder', async ctx => {
    // 获取请求头 token信息
    let headerToken = parseToken.getToken(ctx.header.authorization)
    let tokenInfo
    try {
        // 解析token信息，获取数据
        tokenInfo = token.verify(headerToken)
    } catch (error) {
        console.log(error)
    }
    let userid = tokenInfo.userid
    let orders = ctx.request.body
    if (!orders) {
        return ctx.body = { status: 2, msg: '参数不合法' }
    }


    // 订单详情信息 quantity productid
    let orderDetail = [{ productid: 0, quantity: 0,orderid:0,ordernum:0 }]
  
    // 总价格
    let totalprice = 0
    for (let i = 0; i < orders.orders.length; i++) {
        // 数量
        let quantity = orders.orders[i].quantity
        let productid = orders.orders[i].productId

        // 判断库存是否充足
        let queryQuantity = await knex('product').select('productname','quantity').where({ id:productid }).first()
        if (quantity > queryQuantity.quantity) {
            return ctx.body = { status: 3, msg: `${queryQuantity.productname}库存不足,库存剩余${queryQuantity.quantity}`}
        }

        let obj = Object.assign({ productid, quantity })
        orderDetail[i] = obj
        let upRes = await knex('product').select('unitprice').where({ id:productid }).first()
        totalprice += parseFloat(upRes.unitprice) * parseFloat(quantity)
    }

    // 提交订单

    try {
        await knex.transaction(async trx => {
            // 插入订单
            let ordernum = new Date().getTime() + Math.floor(Math.random() * 10000)
            const data = await trx('order_t').insert({ userid, totalprice,ordernum }, 'id')
            // 添加的订单的id

            // 获取商品id 购买数量
            let obj = [{ quantity: 0, productid: 0 }]
            obj = []
            orderDetail.forEach(item => {
                item.orderid = data[0]
                // item.ordernum = new Date().getTime() + Math.floor(Math.random() * 10000)
                obj.push({ productid: item.productid, quantity: item.quantity })
            })
            // 插入订单详情
            await trx('orderdetail').insert(orderDetail, 'id')

            // 修改商品库存
            for (let i = 0; i < obj.length; i++) {
                await trx.raw(`update product set quantity = quantity-${obj[i].quantity}, heat = heat+${obj[i].quantity}  where id = ${obj[i].productid} returning id`)
            }
        })
        return ctx.body = { status: 1, msg: '订单提交成功' }
    } catch (error) {
        console.log(error)
        return ctx.body = { status: 0, msg: '订单提交失败' }
    }
})

router.get('/findOrder',async ctx=>{
    let headerToken = parseToken.getToken(ctx.header.authorization)
    let tokenInfo
    try {
        // 解析token信息，获取数据
        tokenInfo = token.verify(headerToken)
    } catch (error) {
        console.log(error)
    }
    let userid = tokenInfo.userid
    let data =await knex
            .raw(`select o.id,ad.consignee,ad.phone,ad.address,o.ordertime,o.totalprice,o.ordernum
                    from order_t as o
                    join account as a on a.id = o.userid
                    join address as ad on ad.uid = a.id
                    where a.id = ${userid}
                    order by ordertime desc ,id desc 
            `)
        let result = data.rows
        // 查询订单详情
        for(let i=0;i<result.length;i++){ 
            result[i].detail = await knex('orderdetail as o')
                    .select('o.quantity as quantity','p.productname','p.unitprice','p.unit','p.picture')
                    .join('product as p','p.id','o.productid')
                    .where('orderid', result[i].id)
        }
    ctx.body = result
})

export default router.routes()