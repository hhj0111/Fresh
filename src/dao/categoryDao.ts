import Knex from '../util/knex'

export default class CategoryDao{
    private knex = Knex.getKnex();
    // 查询所有类别
    public findAll(){
        return this.knex('category').select('*')
    }

    // 根据id查找类别名称 
    public findNameById(id){
        return this.knex('category').select('categoryname').where({id}).first()
    }
    
}


