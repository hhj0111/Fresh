import { resolve } from 'path'
import redis from 'redis'
import { config_redis } from '../config/config'

const opts = { auth_pass: config_redis.pwd }
const client = redis.createClient(config_redis.port, config_redis.host, opts)

export default class RedisUtil {

    constructor() {
        this.clientOn()
    }

    public clientOn() {
        client.on('ready', res => {
            console.log('ready')
        })
        client.on('end', err => {
            console.log('end', err)
        })
        client.on('error', err => {
            console.log('error', err)
        })
        client.on('connect', () => {
            console.log('redis connect success!')
        })
    }

    public setData(key,data){
        client.set(key,JSON.stringify(data))
        // 随机生成3000-6000的数字，充当随机过期时间秒数
        let randomTime = Math.ceil((Math.random()*3+3)*1000)
        client.expire(key,randomTime)
    }

    public async getData(key){
        let data = await new Promise((resolve,reject)=>{
            client.get(key,(err,val)=>{
                if(err) return console.log("redis error:"+err)
                resolve(val?JSON.parse(val):val)
            })
        })
        return data;
    }
}