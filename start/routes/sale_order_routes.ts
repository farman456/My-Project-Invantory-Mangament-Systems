import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const SaleOrdersController = () => import('#controllers/sale_orders_controller')
router.group(() => {
  router.get('/', [SaleOrdersController, 'index'])
  router.get('/:saleOrderId', [SaleOrdersController, 'show'])
}).prefix('api/sale-orders').use([middleware.auth()])
router.group(() => {
  router.post('/', [SaleOrdersController, 'create'])
  router.put('/:saleOrderId', [SaleOrdersController, 'update'])
  router.patch('/:saleOrderId', [SaleOrdersController, 'update'])
  router.delete('/:saleOrderId', [SaleOrdersController, 'delete'])
}).prefix('api/sale-orders').use([middleware.auth(), middleware.authorize()])
