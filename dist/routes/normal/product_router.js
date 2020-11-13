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
const productDao_1 = __importDefault(require("../../dao/productDao"));
const router = new koa_router_1.default();
const product = new productDao_1.default();
// 查询所有类别和类别里面所有的商品
router.get('/typeProduct', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield product.findTypeProduct();
    if (data) {
        return ctx.body = { status: 1, data: data, msg: '查询成功' };
    }
    ctx.body = { status: 0, msg: '查询失败' };
}));
// 获取最新商品
router.get('/getNewProductByCid', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield product.findNewProductByCid(ctx.query.cid);
    if (data) {
        return ctx.body = { status: 1, data: data, msg: '查询成功' };
    }
    ctx.body = { status: 0, msg: '查询失败' };
}));
// 根据商品id获取商品详情
router.get('/detail/:id', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield product.findProductById(ctx.params.id);
    if (data) {
        return ctx.body = { status: 1, data: data, msg: '查询成功' };
    }
    ctx.body = { status: 0, msg: '查询失败' };
}));
// 根据商品名称模糊查询
router.get('/findProductLikeName', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let productName = ctx.query.productName;
    let currentPage = ctx.query.currentPage > 0 ? ctx.query.currentPage : 1;
    // 每页记录数
    let size = 15;
    // 商品查询结果
    let data = yield product.findProductLikeProductName({ productName, currentPage, size });
    // 查询总记录数结果
    let rowResult = yield product.findProductLikeProductNameTotalRow(productName);
    // 总记录数
    let totalRow;
    // 总页数
    let totalPage;
    if (rowResult !== undefined) {
        totalRow = rowResult.count;
    }
    totalPage = Math.floor(totalRow % size === 0 ? totalRow / size : totalRow / size + 1);
    // 整合对象
    let result = Object.assign({ totalRow, currentPage, totalPage, data });
    if (data.length >= 0) {
        return ctx.body = { status: 1, data: result, msg: '查询成功' };
    }
    ctx.body = { status: 0, msg: '查询失败' };
}));
// 根据类别查询商品，默认根据更新时间排序，可以按默认/人气/价格进行排序
router.get('/getProductByCid', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let sortType = ctx.query.sortType === undefined ? 'desc' : ctx.query.sortType;
    let sortProperty = ctx.query.sortProperty === undefined ? 'updatedate' : ctx.query.sortProperty;
    let cid = ctx.query.cid;
    let currentPage = ctx.query.currentPage > 0 ? ctx.query.currentPage : 1;
    let size = 15;
    let totalRow;
    let totalPage;
    let data = yield product.findProductByCid({ cid, sortProperty, sortType, currentPage, size });
    let rowResult = yield product.findProductByCidTotalRow(cid);
    if (rowResult !== undefined) {
        totalRow = rowResult.count;
    }
    totalPage = Math.floor(totalRow % size === 0 ? totalRow / size : totalRow / size + 1);
    let result = Object.assign({ totalRow, currentPage, totalPage, data });
    if (data !== undefined) {
        return ctx.body = { status: 1, data: result, msg: '查询成功' };
    }
    ctx.body = { status: 0, msg: '查询失败' };
}));
// 查询商品库存
router.get('/findProductQuantity', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let id = ctx.query.id;
    let data = yield product.findProductQuantity(id);
    if (data) {
        return ctx.body = { status: 1, data: data, msg: '查询成功' };
    }
    ctx.body = { status: 0, msg: '查询失败' };
}));
exports.default = router.routes();
