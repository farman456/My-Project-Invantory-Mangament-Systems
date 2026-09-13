import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const SaleReturnsController = () => import('#controllers/sale_returns_controller')
router.group(() => {
  router.get('/', [SaleReturnsController, 'index'])
  router.get('/:saleReturnId', [SaleReturnsController, 'show'])
}).prefix('api/sale-returns').use([middleware.auth()])
router.group(() => {
  router.post('/', [SaleReturnsController, 'create'])
  router.put('/:saleReturnId', [SaleReturnsController, 'update'])
  router.patch('/:saleReturnId', [SaleReturnsController, 'update'])
  router.delete('/:saleReturnId', [SaleReturnsController, 'delete'])
}).prefix('api/sale-returns').use([middleware.auth(), middleware.authorize()])
