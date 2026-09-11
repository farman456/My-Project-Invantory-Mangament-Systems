import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const InventoryLevelsController = () => import('#controllers/inventory_levels_controller')

router
  .group(() => {
    router.get('/', [InventoryLevelsController, 'index'])
    router.get('/:inventoryLevelId', [InventoryLevelsController, 'show'])
  })
  .prefix('api/inventory-levels')
  .use([middleware.auth(), middleware.authorize()])
