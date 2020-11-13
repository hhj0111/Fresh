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
const accountDao_1 = __importDefault(require("../../dao/accountDao"));
const tokenUtil_1 = __importDefault(require("../../util/tokenUtil"));
const parseHeaderToken_1 = __importDefault(require("../../util/parseHeaderToken"));
const router = new koa_router_1.default();
const account = new accountDao_1.default();
router.get('/findUserInfo', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    // 从请求头中获取token
    let headerToken = parseHeaderToken_1.default.getToken(ctx.header.authorization);
    // 解析token
    let tokenInfo;
    try {
        tokenInfo = yield tokenUtil_1.default.verify(headerToken);
    }
    catch (error) {
        console.log(error);
    }
    let data = yield account.findUserInfo(tokenInfo.id);
    if (!data) {
        return ctx.body = { status: 3, msg: '查询用户信息失败' };
    }
    ctx.body = { status: 1, data: data, msg: '查询成功' };
}));
exports.default = router.routes();
