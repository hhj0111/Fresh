"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("../util/knex"));
class ProductDao {
    constructor() {
        this.knex = knex_1.default.getKnex();
    }
    // 查询首页类别商品信息 
    findTypeProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            // interface typeProduct
            let typeProduct = yield this.knex('category').select('*');
            for (let i = 0; i < typeProduct.length; i++) {
                // 根据cid查询热度最高的4条商品信息
                typeProduct[i].product = yield this.knex('product')
                    .select('*')
                    .where('cid', typeProduct[i].id)
                    .orderBy('heat', 'desc')
                    .limit(4);
            }
            return typeProduct;
        });
    }
    // 根据id获取商品
    findProductById(id) {
        return this.knex('product').select('*').where('id', id).first();
    }
    // 根据类别查询最新的2条商品
    findNewProductByCid(cid) {
        return this.knex('product').select('*').where('cid', cid).orderBy('updatedate', 'desc').limit(2);
    }
    // 根据商品名称模糊查询查询商品，分页
    findProductLikeProductName({ productName, currentPage, size }) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.knex('product').select('*')
                .where('productname', 'like', `%${productName}%`)
                .orderByRaw('updatedate desc,id desc')
                .limit(size)
                .offset((currentPage - 1) * size);
            return data;
        });
    }
    // 根据商品名称模糊查询记录数
    findProductLikeProductNameTotalRow(productName) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.knex('product').count('id')
                .where('productname', 'like', `%${productName}%`)
                .first();
            return data;
        });
    }
    // 根据商品类别查询商品，根据条件排序、分页
    findProductByCid({ cid, sortType, sortProperty, currentPage, size }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.knex('product').select('*')
                    .where('cid', cid)
                    .orderByRaw(`${sortProperty} ${sortType},id desc`)
                    .limit(size)
                    .offset((currentPage - 1) * size);
                return data;
            }
            catch (error) {
                return undefined;
            }
        });
    }
    // 根据商品类别查询商品记录数
    findProductByCidTotalRow(cid) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.knex('product').count('id')
                .where('cid', cid).first();
            return data;
        });
    }
    // 根据商品id查询库存
    findProductQuantity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.knex('product').select('productname', 'quantity').where({ id }).first();
            return data;
        });
    }
    // 根据商品id查询单价
    findUnitpriceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.knex('product').select('unitprice').where({ id }).first();
            return data;
        });
    }
    // 修改商品库存
    updateQuantity({ pid, quantity }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data;
                yield this.knex.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                    data = trx('product').update({ quantity }, 'id').where('id', pid);
                }));
                return data.length > 0;
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.default = ProductDao;
