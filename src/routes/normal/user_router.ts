import Router from 'koa-router'
import token from '../../util/token'
import parseToken from '../../util/parseHeaderToken'
import Knex from '../../util/knex'

const router = new Router()
const knex = Knex.getKnex()

router.get('/findUserInfo', async ctx => {
    // 从请求头中获取token
    let headerToken = parseToken.getToken(ctx.header.authorization)
    // 解析token
    let tokenInfo
    try {
        tokenInfo = await token.verify(headerToken)
    } catch (error) {
        console.log(error)
    }
    let id = tokenInfo.userid

    let data = await knex('account').
        select('username', 'phone', 'address').
        leftJoin('address', 'address.uid', 'account.id').
        where('account.id', id).first()

    if (!data) {
        return ctx.body = { status: 3, msg: '查询用户信息失败' }
    }
    ctx.body = { status: 1, data: data, msg: '查询成功' }
})

router.get('/findUserAddress', async ctx => {
    let headerToken = parseToken.getToken(ctx.header.authorization)
    // 解析token
    let tokenInfo
    try {
        tokenInfo = await token.verify(headerToken)
    } catch (error) {
        console.log(error)
    }
    let userid = tokenInfo.userid
    let data = await knex('address').select('*').where('uid', userid).first()
    if (!data) return ctx.body = { status: 0, msg: '查询失败' }
    delete data.id
    delete data.uid
    ctx.body = { status: 1, data: data, msg: '查询成功' }
})

// 添加地址或修改地址
router.post('/saveAddress', async ctx => {
    console.log(ctx.request.body.address)
    let consignee = ctx.request.body.address.consignee
    let address = ctx.request.body.address.address
    let postcard = ctx.request.body.address.postcard
    let phone = ctx.request.body.address.phone
    if (!consignee || !address || !postcard || !phone) {
        return ctx.body = { status: 0, msg: '参数不合法' }
    }

    let headerToken = parseToken.getToken(ctx.header.authorization)
    // 解析token
    let tokenInfo
    try {
        tokenInfo = await token.verify(headerToken)
    } catch (error) {
        console.log(error)
    }
    let uid = tokenInfo.userid

    let isHasAddress = await knex('address').select('*').where('uid', uid).first()
    let data
    if (isHasAddress) {
        data = await knex('address').update({ uid, consignee, address, postcard, phone }, 'id').where({ 'id': isHasAddress.id })
    } else {
        data = await knex('address').insert({ uid, consignee, address, postcard, phone }, 'id')
    }

    if (data.length<1) {
        return ctx.body = { status: 0, msg: '编辑失败' }
    }
    // 编辑成功后返回新的地址

    let result = await knex('address').select('*').where('uid', uid).first()
    return ctx.body = { status: 1,data:result, msg: '编辑成功' }
})



export default router.routes()