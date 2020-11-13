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
class AccountDao {
    constructor() {
        this.knex = knex_1.default.getKnex();
    }
    //登录
    normalLogin({ username, password }) {
        // let { username, password } = params
        return this.knex('account')
            .select('id', 'username', 'static')
            .where({ username, password })
            .first();
    }
    // 验证用户名
    checkUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.knex('account').count('id').where({ username });
            return data;
        });
    }
    // 验证邮箱
    checkEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.knex('account').count('id').where({ email });
            return data;
        });
    }
    // 注册
    register(params) {
        const { username, password, email } = params;
        let data = this.knex('account').insert({ username, password, email, static: '0' }, 'id');
        return data;
    }
    // 激活邮箱
    activeEmail(params) {
        const { id, email } = params;
        let data = this.knex('account').update('static', 1, 'id').where({ id, email });
        return data;
    }
    //获取用户信息
    findUserInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.knex('account').
                select('username', 'phone', 'address').
                leftJoin('address', 'address.uid', 'account.id').
                where('account.id', id).first();
            return data;
        });
    }
}
exports.default = AccountDao;
