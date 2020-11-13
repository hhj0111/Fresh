"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_router_1 = __importDefault(require("../routes/normal/product_router"));
const category_router_1 = __importDefault(require("../routes/normal/category_router"));
const account_router_1 = __importDefault(require("../routes/normal/account_router"));
const order_router_1 = __importDefault(require("../routes/normal/order_router"));
const user_router_1 = __importDefault(require("../routes/normal/user_router"));
const koa_router_1 = __importDefault(require("koa-router"));
const router = new koa_router_1.default();
router.use('/api/product', product_router_1.default);
router.use('/api/category', category_router_1.default);
router.use('/api/account', account_router_1.default);
router.use('/api/order', order_router_1.default);
router.use('/api/user', user_router_1.default);
exports.default = router;
