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
const tokenUtil_1 = __importDefault(require("../../util/tokenUtil"));
const parseHeaderToken_1 = __importDefault(require("../../util/parseHeaderToken"));
const productDao_1 = __importDefault(require("../../dao/productDao"));
const orderDao_1 = __importDefault(require("../../dao/orderDao"));
const router = new koa_router_1.default();
const product = new productDao_1.default();
const order = new orderDao_1.default();
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
    let headerToken = parseHeaderToken_1.default.getToken(ctx.header.authorization);
    let tokenInfo;
    try {
        // 解析token信息，获取数据
        tokenInfo = tokenUtil_1.default.verify(headerToken);
    }
    catch (error) {
        console.log(error);
    }
    let userid = tokenInfo.id;
    let orders = ctx.request.body;
    if (!orders) {
        return ctx.body = { status: 2, msg: '参数不合法' };
    }
    // 订单详情信息 quantity productid
    let orderDetail = [{ productid: 0, quantity: 0 }];
    // 总价格
    let totalprice = 0;
    for (let i = 0; i < orders.orders.length; i++) {
        // 数量
        let quantity = orders.orders[i].quantity;
        let productid = orders.orders[i].productId;
        let queryQuantity = yield product.findProductQuantity(productid);
        // 判断库存是否充足
        if (quantity > queryQuantity.quantity) {
            return ctx.body = { status: 3, msg: `${queryQuantity.productname}库存不足` };
        }
        let obj = Object.assign({ productid, quantity });
        orderDetail[i] = obj;
        let upRes = yield product.findUnitpriceById(productid);
        totalprice += parseFloat(upRes.unitprice) * parseFloat(quantity);
    }
    // 提交订单
    let addOrderResult = yield order.addOrder({ userid, totalprice, orderDetail });
    if (addOrderResult)
        return ctx.body = { status: 1, msg: '订单提交成功' };
    return ctx.body = { status: 0, msg: '订单提交失败' };
}));
router.get('/findOrder', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let headerToken = parseHeaderToken_1.default.getToken(ctx.header.authorization);
    let tokenInfo;
    try {
        // 解析token信息，获取数据
        tokenInfo = tokenUtil_1.default.verify(headerToken);
    }
    catch (error) {
        console.log(error);
    }
    let data = yield order.findOrder(tokenInfo.id);
    ctx.body = data;
}));
exports.default = router.routes();
