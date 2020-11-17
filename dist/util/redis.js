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
    setData(key, data) {
        client.set(key, JSON.stringify(data));
        // 随机生成3000-6000的数字，充当随机过期时间秒数
        let randomTime = Math.ceil((Math.random() * 3 + 3) * 1000);
        client.expire(key, randomTime);
    }
    getData(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield new Promise((resolve, reject) => {
                client.get(key, (err, val) => {
                    if (err)
                        return console.log("redis error:" + err);
                    resolve(val ? JSON.parse(val) : val);
                });
            });
            return data;
        });
    }
}
exports.default = RedisUtil;
