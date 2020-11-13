"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config_redis = exports.config_server = exports.config_email = exports.config_token = exports.config_pg = void 0;
const config_server = {
    host: '127.0.0.1',
    port: 3000
};
exports.config_server = config_server;
// 配置knex_postgresql
const config_pg = {
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'root',
        database: 'freshdb'
    },
    debug: true,
    pool: {
        min: 0,
        max: 7,
    },
    acquireConnectionTimeout: 10000,
    migrations: {
        tableName: 'migrations' //数据库迁移，可选
    }
};
exports.config_pg = config_pg;
// 配置email
// 授权码 RBDKKPTULOUARLFK  126邮箱
// nkifxalbxvfcbghb qq邮箱
const config_email = {
    host: 'smtp.126.com',
    // host:'smtp.qq.com',
    // service:'qq',
    port: 465,
    secure: true,
    auth: {
        user: 'huhj0111@126.com',
        pass: 'RBDKKPTULOUARLFK' // 授权码
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
};
exports.config_email = config_email;
// 配置token
const config_token = {
    // token秘钥
    privateKey: 'fresh_token',
    // 过期时间 秒
    time: 60 * 60 * 2,
};
exports.config_token = config_token;
// 配置redis
const config_redis = {
    port: 6379,
    host: '127.0.0.1',
    pwd: '',
};
exports.config_redis = config_redis;
