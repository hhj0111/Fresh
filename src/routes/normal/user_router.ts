import Router from 'koa-router'
import AccountDao from '../../dao/accountDao'
import token from '../../util/tokenUtil'
import parseToken from '../../util/parseHeaderToken'

const router = new Router()
const account = new AccountDao()

router.get('/findUserInfo', async ctx => {
    // 从请求头中获取token
    let headerToken = parseToken.getToken(ctx.header.authorization)
    // 解析token
    let tokenInfo 
    try {
        tokenInfo= await token.verify(headerToken)
    } catch (error) {
        console.log(error)
    }
    let data = await account.findUserInfo(tokenInfo.id)

    if (!data) {
        return ctx.body = { status: 3, msg: '查询用户信息失败' }
    }

    ctx.body = { status: 1, data: data, msg: '查询成功' }

}) 


export default router.routes()