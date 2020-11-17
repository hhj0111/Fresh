import Koa from 'koa'
import Router from 'koa-router'
// import RouterSingelton from './util/router'
import index_router from './routes/index'
import bodyParser from 'koa-bodyparser'
import koajtw from 'koa-jwt'
import { config_token } from './config/config'

export default class ConfigKoa {
    public router: Router
    public app: Koa
    private port: number
    constructor(port: number) {
        this.router = index_router
        this.app = new Koa()
        this.port = port
        this.config_koa_jwt()
        this.configRouter()
        this.startListen()
    }

    private configRouter() {
        // this.app.use(this.router.routes())
        // 
        this.app.use(bodyParser())
        this.app.use(this.router.routes())
        this.app.use(this.router.allowedMethods())
    }
 
    private startListen() {
        this.app.listen(this.port, () => {
            console.log(`the server is running on ${this.port}`)
        })
    }

    // 配置jwt-koa中间件进行权限拦截
    // koa-jwt 默认请求头 ：Authorization:Bearer (此处有空格)+token  请求头

    private config_koa_jwt() {
        // 错误处理
        this.app.use((ctx, next) => {
            return next().catch(err => {
                if (err.status === 401) {
                    // ctx.status = 401
                    ctx.body = { status: 401, msg: '当前没有操作权限，请登录' }
                } else {
                    throw err;
                }
            })
        })

        this.app.use(koajtw({
            // 传入秘钥
            secret: config_token.privateKey
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
        }))
    }



}