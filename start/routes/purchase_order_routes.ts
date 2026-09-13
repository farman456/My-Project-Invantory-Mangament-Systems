import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const PurchaseOrdersController = () => import('#controllers/purchase_orders_controller')

router
  .group(() => {
    router.get('/', [PurchaseOrdersController, 'index'])
    router.get('/:purchaseOrderId', [PurchaseOrdersController, 'show'])
  })
  .prefix('api/purchase-orders')
  .use([middleware.auth()])

router
  .group(() => {
    router.post('/', [PurchaseOrdersController, 'create'])
    router.put('/:purchaseOrderId', [PurchaseOrdersController, 'update'])
    router.patch('/:purchaseOrderId', [PurchaseOrdersController, 'update'])
    router.delete('/:purchaseOrderId', [PurchaseOrdersController, 'delete'])
  })
  .prefix('api/purchase-orders')
  .use([middleware.auth(), middleware.authorize()])