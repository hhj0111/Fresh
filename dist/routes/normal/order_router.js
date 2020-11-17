"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const token_1 = __importDefault(require("../../util/token"));
const parseHeaderToken_1 = __importDefault(require("../../util/parseHeaderToken"));
const knex_1 = __importDefault(require("../../util/knex"));
const router = new koa_router_1.default();
const knex = knex_1.default.getKnex();
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
router.post('/addOrder', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    // 获取请求头 token信息
    let headerToken = parseHeaderToken_1.default.getToken(ctx.header.authorization);
    let tokenInfo;
    try {
        // 解析token信息，获取数据
        tokenInfo = token_1.default.verify(headerToken);
    }
    catch (error) {
        console.log(error);
    }
    let userid = tokenInfo.userid;
    let orders = ctx.request.body;
    if (!orders) {
        return ctx.body = { status: 2, msg: '参数不合法' };
    }
    // 订单详情信息 quantity productid
    let orderDetail = [{ productid: 0, quantity: 0, orderid: 0, ordernum: 0 }];
    // 总价格
    let totalprice = 0;
    for (let i = 0; i < orders.orders.length; i++) {
        // 数量
        let quantity = orders.orders[i].quantity;
        let productid = orders.orders[i].productId;
        // 判断库存是否充足
        let queryQuantity = yield knex('product').select('productname', 'quantity').where({ id: productid }).first();
        if (quantity > queryQuantity.quantity) {
            return ctx.body = { status: 3, msg: `${queryQuantity.productname}库存不足,库存剩余${queryQuantity.quantity}` };
        }
        let obj = Object.assign({ productid, quantity });
        orderDetail[i] = obj;
        let upRes = yield knex('product').select('unitprice').where({ id: productid }).first();
        totalprice += parseFloat(upRes.unitprice) * parseFloat(quantity);
    }
    // 提交订单
    try {
        yield knex.transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            // 插入订单
            let ordernum = new Date().getTime() + Math.floor(Math.random() * 10000);
            const data = yield trx('order_t').insert({ userid, totalprice, ordernum }, 'id');
            // 添加的订单的id
            // 获取商品id 购买数量
            let obj = [{ quantity: 0, productid: 0 }];
            obj = [];
            orderDetail.forEach(item => {
                item.orderid = data[0];
                // item.ordernum = new Date().getTime() + Math.floor(Math.random() * 10000)
                obj.push({ productid: item.productid, quantity: item.quantity });
            });
            // 插入订单详情
            yield trx('orderdetail').insert(orderDetail, 'id');
            // 修改商品库存
            for (let i = 0; i < obj.length; i++) {
                yield trx.raw(`update product set quantity = quantity-${obj[i].quantity}, heat = heat+${obj[i].quantity}  where id = ${obj[i].productid} returning id`);
            }
        }));
        return ctx.body = { status: 1, msg: '订单提交成功' };
    }
    catch (error) {
        console.log(error);
        return ctx.body = { status: 0, msg: '订单提交失败' };
    }
}));
router.get('/findOrder', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let headerToken = parseHeaderToken_1.default.getToken(ctx.header.authorization);
    let tokenInfo;
    try {
        // 解析token信息，获取数据
        tokenInfo = token_1.default.verify(headerToken);
    }
    catch (error) {
        console.log(error);
    }
    let userid = tokenInfo.userid;
    let data = yield knex
        .raw(`select o.id,ad.consignee,ad.phone,ad.address,o.ordertime,o.totalprice,o.ordernum
                    from order_t as o
                    join account as a on a.id = o.userid
                    join address as ad on ad.uid = a.id
                    where a.id = ${userid}
                    order by ordertime desc ,id desc 
            `);
    let result = data.rows;
    // 查询订单详情
    for (let i = 0; i < result.length; i++) {
        result[i].detail = yield knex('orderdetail as o')
            .select('o.quantity as quantity', 'p.productname', 'p.unitprice', 'p.unit', 'p.picture')
            .join('product as p', 'p.id', 'o.productid')
            .where('orderid', result[i].id);
    }
    ctx.body = result;
}));
exports.default = router.routes();
