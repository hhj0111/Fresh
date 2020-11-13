const config_server = {
    host: '127.0.0.1',
    port: 3000
}
// 配置knex_postgresql
const config_pg = {
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'root',
        database: 'freshdb'
    },
    debug: true, //指明是否开启debug模式，默认为true表示开启
    pool: { //指明数据库连接池的大小，默认为{min: 2, max: 10}
        min: 0,
        max: 7,
    },
    acquireConnectionTimeout: 10000, //指明连接计时器大小，默认为60000ms  
    migrations: {
        tableName: 'migrations' //数据库迁移，可选
    }
}

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
        user: 'huhj0111@126.com', // 邮箱账号
        pass: 'RBDKKPTULOUARLFK' // 授权码
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
}

// 配置token
const config_token = { 
    // token秘钥
    privateKey: 'fresh_token',
    // 过期时间 秒
    time: 60*60*2,
}

// 配置redis
const config_redis = {
    port: 6379,
    host: '127.0.0.1',
    pwd: '',
}


export { config_pg, config_token, config_email, config_server, config_redis }
