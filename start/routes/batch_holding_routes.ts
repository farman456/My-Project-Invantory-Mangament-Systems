import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const BatchHoldingsController = () => import('#controllers/batch_holdings_controller')

router
  .group(() => {
    router.get('/', [BatchHoldingsController, 'index'])
    router.get('/:batchHoldingId', [BatchHoldingsController, 'show'])
    router.post('/', [BatchHoldingsController, 'create'])
    router.post('/:batchHoldingId', [BatchHoldingsController, 'update'])
    router.put('/:batchHoldingId', [BatchHoldingsController, 'update'])
    router.patch('/:batchHoldingId', [BatchHoldingsController, 'update'])
    router.delete('/:batchHoldingId', [BatchHoldingsController, 'delete'])
  })
  .prefix('api/batch-holdings')
  .use([middleware.auth(), middleware.authorize()])
