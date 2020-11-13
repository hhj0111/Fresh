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
const categoryDao_1 = __importDefault(require("../../dao/categoryDao"));
const koa_router_1 = __importDefault(require("koa-router"));
const router = new koa_router_1.default();
const category = new categoryDao_1.default();
router.get('/getCategory', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield category.findAll();
    if (data) {
        return ctx.body = { status: 1, data: data, msg: '查询成功' };
    }
    ctx.body = { status: 0, msg: '查询失败' };
}));
router.get('/findNameById', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield category.findNameById(ctx.query.id);
    if (data) {
        return ctx.body = { status: 1, data: data, msg: '查询成功' };
    }
    ctx.body = { status: 0, msg: '查询失败' };
}));
exports.default = router.routes();
