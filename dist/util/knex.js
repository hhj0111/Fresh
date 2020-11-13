"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const config_1 = require("../config/config");
class KnexSingleton {
    constructor() { }
    static getKnex() {
        return this.knex;
    }
}
exports.default = KnexSingleton;
KnexSingleton.knex = knex_1.default(config_1.config_pg);
