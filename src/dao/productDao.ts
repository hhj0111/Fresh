import Knex from '../util/knex'

export default class ProductDao {
    private knex = Knex.getKnex()

    // 查询首页类别商品信息 
    public async findTypeProduct() {
        // interface typeProduct
        let typeProduct = await this.knex('category').select('*');
        for (let i = 0; i < typeProduct.length; i++) {
            // 根据cid查询热度最高的4条商品信息
            typeProduct[i].product = await this.knex('product')
                .select('*')
                .where('cid', typeProduct[i].id)
                .orderBy('heat', 'desc')
                .limit(4);
        }
        return typeProduct
    }

    // 根据id获取商品
    public findProductById(id: string) {
        return this.knex('product').select('*').where('id', id).first()
    }

    // 根据类别查询最新的2条商品
    public findNewProductByCid(cid: number) {
        return this.knex('product').select('*').where('cid', cid).orderBy('updatedate', 'desc').limit(2)
    }

    // 根据商品名称模糊查询查询商品，分页
    public async findProductLikeProductName({ productName, currentPage, size }) {
        let data = await this.knex('product').select('*')
            .where('productname', 'like', `%${productName}%`)
            .orderByRaw('updatedate desc,id desc')
            .limit(size)
            .offset((currentPage - 1) * size)
        return data
    }

    // 根据商品名称模糊查询记录数
    public async findProductLikeProductNameTotalRow(productName) {
        let data = await this.knex('product').count('id')
            .where('productname', 'like', `%${productName}%`)
            .first()
        return data
    }

    // 根据商品类别查询商品，根据条件排序、分页
    public async findProductByCid({ cid, sortType, sortProperty, currentPage, size }) {
        try {
            let data = await this.knex('product').select('*')
                .where('cid', cid)
                .orderByRaw(`${sortProperty} ${sortType},id desc`)
                .limit(size)
                .offset((currentPage - 1) * size)
            return data
        } catch (error) {
            return undefined
        }
    }

    // 根据商品类别查询商品记录数
    public async findProductByCidTotalRow(cid) {
        let data = await this.knex('product').count('id')
            .where('cid', cid).first()
        return data
    }

    // 根据商品id查询库存
    public async findProductQuantity(id) {
        let data = await this.knex('product').select('productname','quantity').where({ id }).first()
        return data 
    }

    // 根据商品id查询单价
    public async findUnitpriceById(id) {
        let data = await this.knex('product').select('unitprice').where({ id }).first()
        return data
    }

    // 修改商品库存
    public async updateQuantity({pid,quantity}){
        try {
            let data
            await this.knex.transaction(async trx=>{
                data = trx('product').update({quantity},'id').where('id',pid)
            })
            return data.length>0
        } catch (error) {
            return false
        }
    }

}
