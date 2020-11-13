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
const redis_1 = __importDefault(require("redis"));
const config_1 = require("../config/config");
const opts = { auth_pass: config_1.config_redis.pwd };
const client = redis_1.default.createClient(config_1.config_redis.port, config_1.config_redis.host, opts);
class RedisUtil {
    constructor() {
        this.clientOn();
    }
    clientOn() {
        client.on('ready', res => {
            console.log('ready');
        });
        client.on('end', err => {
            console.log('end', err);
        });
        client.on('error', err => {
            console.log('error', err);
        });
        client.on('connect', () => {
            console.log('redis connect success!');
        });
    }
    // 保存token
    static setToken({ userId, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield client.set(`permission_userId_${userId}`, token, redis_1.default.print);
            client.expire(`permission_userId_${userId}`, 60 * 60 * 2);
            return result;
        });
    }
    // 获取token 
    static getToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield new Promise((resolve, reject) => {
                client.get(`permission_userId_${userId}`, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                });
            });
            return res;
        });
    }
    // 删除token
    static deleteToken(userId) {
        client.del(`permission_userId_${userId}`);
    }
}
exports.default = RedisUtil;
