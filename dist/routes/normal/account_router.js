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
const emailUtil_1 = __importDefault(require("../../util/emailUtil"));
// import redis from '../../util/redis'
const router = new koa_router_1.default();
const account = new accountDao_1.default();
const emailUtil = new emailUtil_1.default();
// 登录
router.post('/doLogin', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let params = ctx.request.body;
    if (!params.password || !params.username) {
        return ctx.body = { status: 5, msg: '参数不合法' };
    }
    let data = yield account.normalLogin(params);
    if (!data)
        return ctx.body = { status: 4, msg: '账户或密码有误' };
    if (data.static === 0)
        return ctx.body = { status: 0, msg: '账户未激活' };
    if (data.static === 2)
        return ctx.body = { status: 2, msg: '账户已被禁用' };
    if (data.static == 3)
        return ctx.body = { status: 3, msg: '账户已不存在,请重新注册' };
    if (data.static === 1) {
        delete data.static;
        let token = tokenUtil_1.default.sign(data);
        // let flag = redis.setToken({ 'userId': data.id, 'token': token })
        // console.log(flag) 
        // delete data.id
        return ctx.body = { status: 1, token: token, username: data.username, msg: '登陆成功' };
    }
}));
// 验证用户名是否存在
router.get('/checkUsername', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let username = ctx.query.username;
    console.log(username);
    let data = yield account.checkUsername(username);
    if (data[0].count > 0) {
        return ctx.body = { status: 0, msg: '该用户名已存在' };
    }
    ctx.body = { status: 1, msg: '该用户名可用' };
}));
// 验证邮箱是否存在
router.get('/checkEmail', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let email = ctx.query.email;
    let data = yield account.checkEmail(email);
    if (data[0].count > 0) {
        return ctx.body = { status: 0, msg: '该邮箱已被注册' };
    }
    ctx.body = { status: 1, msg: '该邮箱可用' };
}));
// 注册
router.post('/doRegister', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let { username, password, email } = ctx.request.body;
    if (username === undefined || password === undefined || email === undefined) {
        return ctx.body = { static: 0, msg: '请完善信息' };
    }
    if (username.length < 3 || password.length < 5) {
        return ctx.body = { static: 2, msg: '请正确填写信息' };
    }
    let data = yield account.register(ctx.request.body);
    // 如果注册成功则发送邮件
    if (data[0] > 0) {
        // 发送邮件
        emailUtil.sendEmail({ 'email': ctx.request.body.email, 'id': data[0] });
        ctx.body = { static: 1, msg: '注册成功！已发送激活激活链接到邮箱，请到邮箱激活' };
    }
    else {
        ctx.body = { static: 3, msg: '注册失败' };
    }
}));
// 激活邮箱
router.get('/activeEmail', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield account.activeEmail(ctx.query);
    if (data[0] > 0) {
        console.log('激活成功');
        ctx.redirect('http://localhost:3001/login');
    }
}));
// 退出登录
router.get('/logout', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let userId = ctx.query.id;
    // await redis.deleteToken(userId)
    ctx.body = { status: 1, msg: '已退出登录' };
}));
// 测试redis
router.get('/getToken', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    // let token = await redis.getToken(2)
    // ctx.body = token
}));
exports.default = router.routes();
