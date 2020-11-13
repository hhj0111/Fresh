"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("../util/knex"));
class CategoryDao {
    constructor() {
        this.knex = knex_1.default.getKnex();
    }
    // 查询所有类别
    findAll() {
        return this.knex('category').select('*');
    }
    // 根据id查找类别名称 
    findNameById(id) {
        return this.knex('category').select('categoryname').where({ id }).first();
    }
}
exports.default = CategoryDao;
