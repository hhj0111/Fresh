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
router.get('/findUserInfo', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    // 从请求头中获取token
    let headerToken = parseHeaderToken_1.default.getToken(ctx.header.authorization);
    // 解析token
    let tokenInfo;
    try {
        tokenInfo = yield token_1.default.verify(headerToken);
    }
    catch (error) {
        console.log(error);
    }
    let id = tokenInfo.userid;
    let data = yield knex('account').
        select('username', 'phone', 'address').
        leftJoin('address', 'address.uid', 'account.id').
        where('account.id', id).first();
    if (!data) {
        return ctx.body = { status: 3, msg: '查询用户信息失败' };
    }
    ctx.body = { status: 1, data: data, msg: '查询成功' };
}));
router.get('/findUserAddress', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let headerToken = parseHeaderToken_1.default.getToken(ctx.header.authorization);
    // 解析token
    let tokenInfo;
    try {
        tokenInfo = yield token_1.default.verify(headerToken);
    }
    catch (error) {
        console.log(error);
    }
    let userid = tokenInfo.userid;
    let data = yield knex('address').select('*').where('uid', userid).first();
    if (!data)
        return ctx.body = { status: 0, msg: '查询失败' };
    delete data.id;
    delete data.uid;
    ctx.body = { status: 1, data: data, msg: '查询成功' };
}));
// 添加地址或修改地址
router.post('/saveAddress', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(ctx.request.body.address);
    let consignee = ctx.request.body.address.consignee;
    let address = ctx.request.body.address.address;
    let postcard = ctx.request.body.address.postcard;
    let phone = ctx.request.body.address.phone;
    if (!consignee || !address || !postcard || !phone) {
        return ctx.body = { status: 0, msg: '参数不合法' };
    }
    let headerToken = parseHeaderToken_1.default.getToken(ctx.header.authorization);
    // 解析token
    let tokenInfo;
    try {
        tokenInfo = yield token_1.default.verify(headerToken);
    }
    catch (error) {
        console.log(error);
    }
    let uid = tokenInfo.userid;
    let isHasAddress = yield knex('address').select('*').where('uid', uid).first();
    let data;
    if (isHasAddress) {
        data = yield knex('address').update({ uid, consignee, address, postcard, phone }, 'id').where({ 'id': isHasAddress.id });
    }
    else {
        data = yield knex('address').insert({ uid, consignee, address, postcard, phone }, 'id');
    }
    if (data.length < 1) {
        return ctx.body = { status: 0, msg: '编辑失败' };
    }
    // 编辑成功后返回新的地址
    let result = yield knex('address').select('*').where('uid', uid).first();
    return ctx.body = { status: 1, data: result, msg: '编辑成功' };
}));
exports.default = router.routes();
