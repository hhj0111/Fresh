import Knex from 'knex'
import {config_pg} from '../config/config'

export default class KnexSingleton {
    private static knex:Knex = Knex(config_pg);
    private constructor() {}
    public static getKnex():Knex{
        return this.knex;
    }
}  