import Knex from '../util/knex'

export default class AddressDao{
    private knex = Knex.getKnex()

    public async updateAddressByUid({uid,consignee,address,postcard,phone}){
        let findAddress = await this.findUserAddress(uid) 
        if(findAddress){
            return this.knex('address').update({uid,consignee,address,postcard,phone},'id').where({'id':findAddress.id})
        }else{
            return this.knex('address').insert({uid,consignee,address,postcard,phone},'id')
        }
    }

    public findUserAddress(uid){
        return this.knex('address').select('*').where({uid}).first()
    }

}