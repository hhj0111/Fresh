import Knex from '../util/knex'

export default class OrderDetal{
    private knex = Knex.getKnex()

    // 添加订单详情
    public async addOrderDetail(params){
        const {orderId,productId,quantity,orderNum} = params;
        let data = await this.knex('orderDetail').insert({orderId,productId,quantity,orderNum},'id')
        return data
    } 
}