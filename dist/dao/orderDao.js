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
const knex_1 = __importDefault(require("../util/knex"));
class OrderDao {
    constructor() {
        this.knex = knex_1.default.getKnex();
    }
    // 添加订单
    // 用户id 1,商品1=》数量2，总价格 数量*单价，地址1 
    addOrder({ userid, totalprice, orderDetail }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let flag;
                yield this.knex.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                    // 插入订单
                    const data = yield trx('order_t').insert({ userid, totalprice }, 'id');
                    // 添加的订单的id
                    // 获取商品id 购买数量
                    let obj = [{ quantity: 0, productid: 0 }];
                    obj = [];
                    orderDetail.forEach(item => {
                        item.orderid = data[0];
                        item.ordernum = new Date().getTime() + Math.floor(Math.random() * 10000);
                        obj.push({ productid: item.productid, quantity: item.quantity });
                    });
                    // 插入订单详情
                    const addDetailResult = yield trx('orderdetail').insert(orderDetail, 'id');
                    // 修改商品库存
                    for (let i = 0; i < obj.length; i++) {
                        yield trx.raw(`update product set quantity = quantity-${obj[i].quantity}, heat = heat+${obj[i].quantity}  where id = ${obj[i].productid} returning id`);
                    }
                    if (data.length > 0 && addDetailResult.length === orderDetail.length) {
                        return flag = true;
                    }
                    return flag = false;
                }));
                return flag;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    // 添加订单详情
    addOrderDetail({ orderid, productid, quantity, ordernum }) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.knex('orderdetail').insert({ orderid, productid, quantity, ordernum }, 'id');
            return data;
        });
    }
    // 根据用户id查询订单
    findOrder(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.knex
                .raw(`select o.id,ad.consignee,ad.phone,ad.address,o.ordertime,o.totalprice
                    from order_t as o
                    join account as a on a.id = o.userid
                    join address as ad on ad.uid = a.id
                    where a.id = ${userid}
                    order by ordertime desc ,id desc 
            `);
            let result = data.rows;
            // 查询订单详情
            for (let i = 0; i < result.length; i++) {
                result[i].detail = yield this.findOrderDetail(result[i].id);
            }
            return result;
        });
    }
    // 根据订单id查询订单详情
    findOrderDetail(orderid) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.knex('orderdetail').select('*').where('orderid', orderid);
            return data;
        });
    }
}
exports.default = OrderDao;
