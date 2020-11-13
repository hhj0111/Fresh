import Knex from '../util/knex'

export default class OrderDao {
    private knex = Knex.getKnex()

    // 添加订单
    // 用户id 1,商品1=》数量2，总价格 数量*单价，地址1 
    public async addOrder({ userid, totalprice, orderDetail }) {
        try {

            let flag
            await this.knex.transaction(async trx => {
                // 插入订单
                const data = await trx('order_t').insert({ userid, totalprice }, 'id')
                // 添加的订单的id

                // 获取商品id 购买数量
                let obj = [{ quantity: 0, productid: 0 }]
                obj = []
                orderDetail.forEach(item => {
                    item.orderid = data[0]
                    item.ordernum = new Date().getTime() + Math.floor(Math.random() * 10000)
                    obj.push({ productid: item.productid, quantity: item.quantity })
                })
                // 插入订单详情
                const addDetailResult = await trx('orderdetail').insert(orderDetail, 'id')

                // 修改商品库存
                for (let i = 0; i < obj.length; i++) {
                    await trx.raw(`update product set quantity = quantity-${obj[i].quantity}, heat = heat+${obj[i].quantity}  where id = ${obj[i].productid} returning id`)
                }

                if (data.length > 0 && addDetailResult.length === orderDetail.length) {
                    return flag = true
                }
                return flag = false
            })
            return flag
        } catch (error) {
            console.log(error)
            return false
        }
    }

    // 添加订单详情
    public async addOrderDetail({ orderid, productid, quantity, ordernum }) {
        let data = await this.knex('orderdetail').insert({ orderid, productid, quantity, ordernum }, 'id')
        return data
    }

    // 根据用户id查询订单
    public async findOrder(userid) {
        let data = await this.knex
            .raw(`select o.id,ad.consignee,ad.phone,ad.address,o.ordertime,o.totalprice
                    from order_t as o
                    join account as a on a.id = o.userid
                    join address as ad on ad.uid = a.id
                    where a.id = ${userid}
                    order by ordertime desc ,id desc 
            `)
        let result = data.rows
        // 查询订单详情
        for(let i=0;i<result.length;i++){ 
            result[i].detail = await this.findOrderDetail(result[i].id)
        }
        return result
    }

    // 根据订单id查询订单详情
    public async findOrderDetail(orderid) {
        let data = await this.knex('orderdetail').select('*').where('orderid', orderid)
        return data
    }

}