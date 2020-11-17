"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
// import RouterSingelton from './util/router'
const index_1 = __importDefault(require("./routes/index"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_jwt_1 = __importDefault(require("koa-jwt"));
const config_1 = require("./config/config");
class ConfigKoa {
    constructor(port) {
        this.router = index_1.default;
        this.app = new koa_1.default();
        this.port = port;
        this.config_koa_jwt();
        this.configRouter();
        this.startListen();
    }
    configRouter() {
        // this.app.use(this.router.routes())
        // 
        this.app.use(koa_bodyparser_1.default());
        this.app.use(this.router.routes());
        this.app.use(this.router.allowedMethods());
    }
    startListen() {
        this.app.listen(this.port, () => {
            console.log(`the server is running on ${this.port}`);
        });
    }
    // 配置jwt-koa中间件进行权限拦截
    // koa-jwt 默认请求头 ：Authorization:Bearer (此处有空格)+token  请求头
    config_koa_jwt() {
        // 错误处理
        this.app.use((ctx, next) => {
            return next().catch(err => {
                if (err.status === 401) {
                    // ctx.status = 401
                    ctx.body = { status: 401, msg: '当前没有操作权限，请登录' };
                }
                else {
                    throw err;
                }
            });
        });
        this.app.use(koa_jwt_1.default({
            // 传入秘钥
            secret: config_1.config_token.privateKey
        }).unless({
            // 过滤不用经过token验证的url
            /*
                /api/account
                /api/product
                /api/category

                其他url请求都必须携带token请求头
            */
            path: [
                /^\/api\/account/,
                /^\/api\/product/,
                /^\/api\/category/
            ]
        }));
    }
}
exports.default = ConfigKoa;
