import Knex from '../util/knex'

export default class AccountDao {
    private knex = Knex.getKnex();
    //登录
    public normalLogin({ username, password }) {
        // let { username, password } = params
        return this.knex('account')
            .select('id', 'username', 'static')
            .where({ username, password })
            .first(); 
    }

    // 验证用户名
    public async checkUsername(username: string) {
        let data = await this.knex('account').count('id').where({ username })
        return data
    }
 
    // 验证邮箱
    public async checkEmail(email: string) {
        let data = await this.knex('account').count('id').where({ email })
        return data
    }


    // 注册
    public register(params) {
        const { username, password, email } = params
        let data = this.knex('account').insert({ username, password, email, static: '0' }, 'id');
        return data
    }

    // 激活邮箱
    public activeEmail(params) {
        const { id, email } = params
        let data = this.knex('account').update('static', 1, 'id').where({ id, email })
        return data
    }

    //获取用户信息
    public async findUserInfo(id) {
        let data = await this.knex('account').
            select('username', 'phone', 'address').
            leftJoin('address', 'address.uid', 'account.id').
            where('account.id', id).first()
        return data
    }
} 