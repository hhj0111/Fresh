import Router from 'koa-router'
import jwt from '../../util/token'
import EmailUtil from '../../util/email'
import Knex from '../../util/knex'
// import redis from '../../util/redis'

const router = new Router()
const emailUtil = new EmailUtil()
const knex = Knex.getKnex()

// 登录
router.post('/doLogin', async ctx => {
    let username = ctx.request.body.username
    let password = ctx.request.body.password
    if (!password || !username) {
        return ctx.body = { status: 5, msg: '参数不合法' }
    }
    let data = await knex('account')
        .select('id', 'username', 'static')
        .where({ username, password })
        .first(); 

    if (!data)
        return ctx.body = { status: 4, msg: '账户或密码有误' }
    if (data.static === 0)
        return ctx.body = { status: 0, msg: '账户未激活' }
    if (data.static === 2)
        return ctx.body = { status: 2, msg: '账户已被禁用' }
    if (data.static == 3)
        return ctx.body = { status: 3, msg: '账户已不存在,请重新注册' }
    if (data.static === 1) {
        delete data.static
        // 登录成功，将id保存到redis
        let token = jwt.sign({userid:data.id})
        // let flag = redis.setToken({ 'userId': data.id, 'token': token })
        // console.log(flag) 
        // delete data.id
        return ctx.body = { status: 1, data:{token: token, username: data.username}, msg: '登陆成功' };
    }
})

// 验证用户名是否存在
router.get('/checkUsername', async ctx => {
    let username = ctx.query.username
    console.log(username)
    let data = await knex('account').count('id').where({ username })
    if (data[0].count > 0) {
        return ctx.body = { status: 0, msg: '该用户名已存在' }
    }
    ctx.body = { status: 1, msg: '该用户名可用' }
})

// 验证邮箱是否存在
router.get('/checkEmail', async ctx => {
    let email = ctx.query.email
    let data = await knex('account').count('id').where({ email })
    if (data[0].count > 0) {
        return ctx.body = { status: 0, msg: '该邮箱已被注册' }
    }
    ctx.body = { status: 1, msg: '该邮箱可用' }
})

// 注册
router.post('/doRegister', async ctx => {
    let { username, password, email } = ctx.request.body
    if (username === undefined || password === undefined || email === undefined) {
        return ctx.body = { static: 0, msg: '请完善信息' }
    }
    if (username.length < 3 || password.length < 5) {
        return ctx.body = { static: 2, msg: '请正确填写信息' }
    }
    let data = await knex('account').insert({ username, password, email, static: '0' }, 'id');

    // 如果注册成功则发送邮件
    if (data[0] > 0) {
        // 发送邮件
        emailUtil.sendEmail({ 'email': ctx.request.body.email, 'id': data[0] })
        ctx.body = { static: 1, msg: '注册成功！已发送激活激活链接到邮箱，请到邮箱激活' }
    } else {
        ctx.body = { static: 3, msg: '注册失败' }
    }
});

// 激活邮箱
router.get('/activeEmail', async ctx => {
    let id = ctx.query.id
    let email = ctx.query.email
    let data = await knex('account').update('static', 1, 'id').where({ id, email })
    if (data[0] > 0) {
        console.log('激活成功')
        ctx.redirect('http://localhost:3001/login')
    }
})



export default router.routes()