import Router from 'koa-router'
import token from '../../util/tokenUtil'
import parseToken from '../../util/parseHeaderToken'
import ProductDao from '../../dao/productDao'
import OrderDao from '../../dao/orderDao'

const router = new Router()
const product = new ProductDao()
const order = new OrderDao()

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
    let headerToken = parseToken.getToken(ctx.header.authorization)
    let tokenInfo
    try {
        // 解析token信息，获取数据
        tokenInfo = token.verify(headerToken)
    } catch (error) {
        console.log(error)
    }
    let userid = tokenInfo.id
    let orders = ctx.request.body
    if (!orders) {
        return ctx.body = { status: 2, msg: '参数不合法' }
    }

    // 订单详情信息 quantity productid
    let orderDetail = [{ productid: 0, quantity: 0 }]
  
    // 总价格
    let totalprice = 0
    for (let i = 0; i < orders.orders.length; i++) {
        // 数量
        let quantity = orders.orders[i].quantity
        let productid = orders.orders[i].productId
        let queryQuantity = await product.findProductQuantity(productid)
        // 判断库存是否充足
        if (quantity > queryQuantity.quantity) {
            return ctx.body = { status: 3, msg: `${queryQuantity.productname}库存不足`}
        }
        let obj = Object.assign({ productid, quantity })
        orderDetail[i] = obj
        let upRes = await product.findUnitpriceById(productid)
        totalprice += parseFloat(upRes.unitprice) * parseFloat(quantity)
    }

    // 提交订单
    let addOrderResult = await order.addOrder({ userid, totalprice, orderDetail })

    if (addOrderResult)
        return ctx.body = { status: 1, msg: '订单提交成功' }
    return ctx.body = { status: 0, msg: '订单提交失败' }
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
    let data =await order.findOrder(tokenInfo.id)
    ctx.body = data    
})

export default router.routes()