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

    // 保存token
    public static async setToken({ userId, token }) {
        let result = await client.set(`permission_userId_${userId}`, token, redis.print)
        client.expire(`permission_userId_${userId}`,60*60*2)
        return result
    }

    // 获取token 
    public static async getToken(userId) {
        
        let res = await new Promise((resolve,reject)=>{
            client.get(`permission_userId_${userId}`,(err,res)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(res)
                }
            })
        })
        return res             
    }

    // 删除token
    public static deleteToken (userId){
        client.del(`permission_userId_${userId}`)
    }

}