import * as jwt from 'jsonwebtoken'
import {config_token} from '../config/config'

export default class token {
    public static sign(data:{}){
        const token = jwt.sign(data,config_token.privateKey,{expiresIn:config_token.time})
        return token
    }

    public static verify(token){
        var decoded = jwt.verify(token,config_token.privateKey)
        return decoded
    }
}  