import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const PurchaseReturnsController = () => import('#controllers/purchase_returns_controller')

router
  .group(() => {
    router.get('/', [PurchaseReturnsController, 'index'])
    router.get('/:purchaseReturnId', [PurchaseReturnsController, 'show'])
  })
  .prefix('api/purchase-returns')
  .use([middleware.auth()])

router
  .group(() => {
    router.post('/', [PurchaseReturnsController, 'create'])
    router.put('/:purchaseReturnId', [PurchaseReturnsController, 'update'])
    router.patch('/:purchaseReturnId', [PurchaseReturnsController, 'update'])
    router.delete('/:purchaseReturnId', [PurchaseReturnsController, 'delete'])
  })
  .prefix('api/purchase-returns')
  .use([middleware.auth(), middleware.authorize()])