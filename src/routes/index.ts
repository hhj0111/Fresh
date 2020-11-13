import product_router from '../routes/normal/product_router'
import category_router from '../routes/normal/category_router'
import account_router from '../routes/normal/account_router'
import order_router from '../routes/normal/order_router'
import user_router from '../routes/normal/user_router'
import Router from 'koa-router'

const router = new Router()

router.use('/api/product',product_router)
router.use('/api/category',category_router)    
router.use('/api/account',account_router)     
router.use('/api/order',order_router)
router.use('/api/user',user_router)


export default router


  