import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const StockMovementsController = () => import('#controllers/stock_movements_controller')

router
  .group(() => {
    router.get('/', [StockMovementsController, 'index'])
    router.get('/:stockMovementId', [StockMovementsController, 'show'])
    router.post('/', [StockMovementsController, 'create'])
    router.post('/:stockMovementId', [StockMovementsController, 'update'])
    router.put('/:stockMovementId', [StockMovementsController, 'update'])
    router.patch('/:stockMovementId', [StockMovementsController, 'update'])
    router.delete('/:stockMovementId', [StockMovementsController, 'delete'])
  })
  .prefix('api/stock-movements')
  .use([middleware.auth(), middleware.authorize()])
